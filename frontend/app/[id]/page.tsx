"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { Card, CardBody, CardFooter, CardHeader } from "@heroui/card";
import { Image } from "@heroui/image";
import { Button } from "@heroui/button";
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useTransform,
  MotionValue,
} from "motion/react";

import {
  HeartFilledIcon,
  HeartSlashIcon,
  SendIcon,
  UndoIcon,
} from "@/components/icons";
import { title } from "@/components/primitives";

const api_gateway_url = process.env.NEXT_PUBLIC_API_GATEWAY_URL;
const api_gateway_key = process.env.NEXT_PUBLIC_API_GATEWAY_KEY;

type CardProps = {
  id: string;
  title: string;
  imageUrl: string;
  value: number;
};

type PollishCardComponentProps = {
  props: CardProps;
  onLike: (cardIndex: string) => void;
  onDislike: (cardIndex: string) => void;
  cards: CardProps[];
  leftGlowOpacity: MotionValue<number>;
  rightGlowOpacity: MotionValue<number>;
};

function PollishCard({
  props,
  onLike,
  onDislike,
  cards,
  leftGlowOpacity,
  rightGlowOpacity,
}: PollishCardComponentProps) {
  const x = useMotionValue(0);
  const opacity = useTransform(x, [-200, 0, 200], [0, 1, 0]);
  const rotateRaw = useTransform(x, [-200, 200], [-15, 15]);

  const isFront = cards[0]?.id === props.id;

  const rotate = useTransform(() => {
    const offset = isFront ? 0 : cards.indexOf(props) % 2 ? 6 : -6;

    return `${rotateRaw.get() + offset}deg`;
  });

  const handleDragEnd = () => {
    const currentX = x.get();

    if (currentX > 50) {
      onLike(props.id);
    } else if (currentX < -50) {
      onDislike(props.id);
    }
    x.set(0);
  };

  useMotionValueEvent(x, "change", (latest) => {
    const opacity = Math.min(Math.abs(latest) / 100, 1);

    if (latest > 0) {
      rightGlowOpacity.set(opacity);
      leftGlowOpacity.set(0);
    } else if (latest < 0) {
      leftGlowOpacity.set(opacity);
      rightGlowOpacity.set(0);
    } else {
      leftGlowOpacity.set(0);
      rightGlowOpacity.set(0);
    }
  });

  return (
    <motion.div
      animate={{
        scale: isFront ? 1 : 0.98,
      }}
      className="w-72 md:w-96 h-96 rounded-2xl z-30"
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      style={{
        gridRow: 1,
        gridColumn: 1,
        x,
        opacity,
        rotate,
        transition: "0.125s transform",
        boxShadow: isFront
          ? "0 20px 25px -5px rgb(0 0 0 / 0.5), 0 8px 10px -6px rgb(0 0 0 / 0.5)"
          : undefined,
      }}
      onDragEnd={handleDragEnd}
    >
      <Card
        isBlurred
        className="border-none bg-background/60 dark:bg-default-100/50 w-72 md:w-96 h-96 cursor-grab active:cursor-grabbing"
        shadow="sm"
      >
        <CardHeader className="absolute z-10 flex-col !items-start bg-neutral-800/20 backdrop-blur-sm">
          {/* <p className="text-tiny text-white/60 uppercase font-bold">Item {props.index}</p> */}
          <h4 className="text-white font-medium text-large">{props.title}</h4>
        </CardHeader>
        <Image
          removeWrapper
          alt="Card background"
          className="z-0 w-full h-full object-cover"
          src={props.imageUrl}
          onDrag={(e) => e.preventDefault()}
          onDragStart={(e) => e.preventDefault()}
        />
        <CardFooter className="absolute bg-black/40 bottom-0 z-10 w-full flex justify-between items-center rounded-lg">
          <Button
            color="danger"
            radius="lg"
            size="sm"
            onPress={() => onDislike(props.id)}
          >
            <HeartSlashIcon />
          </Button>
          <Button
            color="success"
            radius="lg"
            size="sm"
            onPress={() => onLike(props.id)}
          >
            <HeartFilledIcon />
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}

export default function ViewPollishPage() {
  const { id } = useParams();
  const [pollishName, setPollishName] = useState<string>("Loading...");
  const leftGlowOpacity = useMotionValue(0);
  const rightGlowOpacity = useMotionValue(0);
  const [cards, setCards] = useState<CardProps[]>([]);
  const [backgroundUrl, setBackgroundUrl] = useState<string | null>(null);
  let liked = [];
  let disliked = [];
  // let previousCard = null;

  const handleLike = (cardId: string) => {
    liked.push(cardId);
    // previousCard = cards.find(card => card.index === cardIndex) || null;
    setCards((prev) => prev.filter((card) => card.id !== cardId));
    leftGlowOpacity.set(0);
    rightGlowOpacity.set(0);
  };

  const handleDislike = (cardId: string) => {
    disliked.push(cardId);
    // previousCard = cards.find(card => card.index === cardIndex) || null;
    setCards((prev) => prev.filter((card) => card.id !== cardId));
    leftGlowOpacity.set(0);
    rightGlowOpacity.set(0);
  };

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        // Fetch background from /background endpoint
        const backgroundResponse = await axios.get(
          `${api_gateway_url}/background`,
          {
            params: { pollish_id: id },
            headers: {
              "x-api-key": api_gateway_key!,
            },
          },
        );

        if (backgroundResponse.data?.url) {
          setBackgroundUrl(backgroundResponse.data.url);
        }
      } catch (err) {
        // console.error("Failed to fetch asset URLs", err);
      }
    };

    const fetchPollish = async () => {
      try {
        // Step 1: Fetch pollish and cards
        const pollishResponse = await axios.get(`${api_gateway_url}/get`, {
          params: { id },
          headers: { "x-api-key": api_gateway_key! },
        });

        const pollish = pollishResponse.data;

        setPollishName(pollish.name);
        const cards = pollish.cards || [];

        // Step 2: Fetch presigned URLs
        const assetsResponse = await axios.get(
          `${api_gateway_url}/generate-download-url`,
          {
            params: { id },
            headers: { "x-api-key": api_gateway_key! },
          },
        );

        const assetMap = new Map<string, string>();

        for (const asset of assetsResponse.data.assets || []) {
          assetMap.set(asset.id, asset.url); // Map card ID -> URL
        }

        // Step 3: Merge cards with image URLs
        const enrichedCards = cards.map((card: any) => ({
          id: card.id,
          title: card.title,
          value: card.value,
          imageUrl: assetMap.get(card.id) || "/placeholder.png",
        }));

        setCards(enrichedCards);
      } catch (err) {
        // console.error("Failed to fetch pollish", err);
        setPollishName("Pollish Not Found");
      }
    };

    if (id) {
      fetchPollish();
      fetchAssets();
    }
  }, [id]);

  return (
    <div
      className="max-w-xl w-full p-2 text-center flex flex-col items-center gap-6 h-full rounded-lg"
      style={{
        backgroundImage: backgroundUrl ? `url(${backgroundUrl})` : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <motion.div
        className="absolute left-0 top-1/2 -translate-y-1/2 pointer-events-none z-10"
        style={{
          width: "100px",
          height: "200px",
          borderTopLeftRadius: "100px",
          borderBottomLeftRadius: "100px",
          backgroundColor: "red",
          opacity: leftGlowOpacity,
          filter: `blur(100px)`,
        }}
      />
      <motion.div
        className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none z-10"
        style={{
          width: "100px",
          height: "200px",
          borderTopLeftRadius: "100px",
          borderBottomLeftRadius: "100px",
          backgroundColor: "lime",
          opacity: rightGlowOpacity,
          filter: `blur(100px)`,
        }}
      />
      <h1
        className={title({ color: "yellow", size: "lg" }) + " capitalize z-40"}
      >
        {pollishName}
      </h1>
      <div className="grid place-items-center h-full">
        {cards.length > 0 ? (
          cards
            .slice()
            .reverse()
            .map((card) => {
              return (
                <PollishCard
                  key={card.id}
                  cards={cards}
                  leftGlowOpacity={leftGlowOpacity}
                  props={card}
                  rightGlowOpacity={rightGlowOpacity}
                  onDislike={handleDislike}
                  onLike={handleLike}
                />
              );
            })
        ) : (
          <motion.div
            drag
            dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
          >
            <Card
              isBlurred
              className="border-none bg-background/60 dark:bg-default-100/50 w-72 md:w-96 h-96 cursor-grab active:cursor-grabbing"
              shadow="sm"
            >
              <CardBody className="grid place-items-center h-full">
                <p className="text-center text-large font-medium">
                  No more cards 🙁
                </p>
              </CardBody>
            </Card>
          </motion.div>
        )}
      </div>
      <div className="w-full flex justify-center items-center gap-2">
        {/* <Button color="danger" size="lg" onPress={() => undoLast()}>
                    Undo
                </Button> */}
        <Button
          color="default"
          radius="lg"
          size="md"
          onPress={() => window.location.reload()}
        >
          <UndoIcon />
        </Button>
        <Button
          color="primary"
          radius="lg"
          size="md"
          onPress={() => window.location.reload()}
        >
          <SendIcon />
        </Button>
      </div>
    </div>
  );
}
