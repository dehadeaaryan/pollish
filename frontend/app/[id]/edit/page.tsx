"use client";

import { Key, useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { Card, CardBody, CardFooter, CardHeader } from "@heroui/card";
import { Image } from "@heroui/image";
import { Button } from "@heroui/button";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/dropdown";
import { motion, useMotionValue, useTransform } from "motion/react";
import { Popover, PopoverContent, PopoverTrigger } from "@heroui/popover";
import { Input } from "@heroui/input";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@heroui/modal";

import {
  CancelIcon,
  CheckIcon,
  ClipboardIcon,
  EditIcon,
  MailIcon,
  MessageCircleIcon,
  SaveIcon,
  TrashIcon,
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
  pollish_id: string;
  props: CardProps;
  cards: CardProps[];
  setCards: (cards: CardProps[]) => void;
};

function PollishCard({
  pollish_id,
  props,
  setCards,
  cards,
}: PollishCardComponentProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(props.title);
  const [imagePreview, setImagePreview] = useState(props.imageUrl);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      const url = URL.createObjectURL(file);

      setImagePreview(url);
      // 🔧 TODO: Upload logic here
    }
  };

  const handleSave = async () => {
    const file = fileInputRef.current?.files?.[0];

    const data: any = {
      pollish_id: pollish_id,
      card_id: props.id,
      title: title,
    };

    if (file) {
      data.image_type = file.type;
    }

    try {
      const response = await axios.put(`${api_gateway_url}/card`, data, {
        headers: {
          "x-api-key": api_gateway_key!,
          "Content-Type": "application/json",
        },
      });

      if (file && response.data.upload_url) {
        await axios.put(response.data.upload_url, file, {
          headers: {
            "Content-Type": file.type,
          },
        });
      }

      setIsEditing(false);
    } catch (error) {
      // console.error("Error saving card:", error);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setTitle(props.title);
    setImagePreview(props.imageUrl);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${api_gateway_url}/card`, {
        headers: {
          "x-api-key": api_gateway_key!,
        },
        params: {
          pollish_id: pollish_id,
          card_id: props.id,
        },
      });
      setCards(cards.filter((card) => card.id !== props.id));
    } catch (error) {
      // console.error("Error deleting card:", error);
      alert("Failed to delete card.");
    } finally {
      setIsPopoverOpen(false);
    }
  };

  const x = useMotionValue(0);
  const rotateRaw = useTransform(x, [-200, 200], [-15, 15]);

  const isFront = cards[0]?.id === props.id;

  const rotate = useTransform(() => {
    const offset = isFront ? 0 : cards.indexOf(props) % 2 ? 6 : -6;

    return `${rotateRaw.get() + offset}deg`;
  });

  const handleDragEnd = () => {
    if (isEditing || cards.length < 2) {
      x.set(0);

      return;
    }
    const currentX = x.get();

    if (Math.abs(currentX) > 100 && isFront) {
      const updatedCards = [...cards.slice(1), cards[0]];

      console.log("Card swiped:", props.id);
      setCards(updatedCards);
    }
    x.set(0);
  };

  return (
    <motion.div
      animate={{
        scale: isFront ? 1 : 0.98,
      }}
      className="w-72 md:w-96 h-96 rounded-2xl"
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      style={{
        gridRow: 1,
        gridColumn: 1,
        x,
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
        <CardHeader className="absolute z-10 flex-col !items-start bg-neutral-800/20 backdrop-blur-sm rounded-sm capitalize text-ellipsis">
          {/* <p className="text-tiny text-white/60 uppercase font-bold">Item {props.index}</p> */}
          {isEditing ? (
            <Input
              label="Title"
              value={title}
              variant="underlined"
              onChange={(e) => setTitle(e.target.value)}
            />
          ) : (
            <h4 className="text-white font-medium text-large">{title}</h4>
          )}
        </CardHeader>

        <Image
          removeWrapper
          alt="Card background"
          className="z-0 w-full h-full object-cover"
          src={imagePreview}
          style={{
            cursor: isEditing
              ? "pointer"
              : "cursor-grab active:cursor-grabbing",
            opacity: isEditing ? 0.6 : 1,
          }}
          onClick={() => isEditing && fileInputRef.current?.click()}
          onDrag={(e) => e.preventDefault()}
          onDragStart={(e) => e.preventDefault()}
        />
        <input
          ref={fileInputRef}
          accept="image/*"
          style={{ display: "none" }}
          type="file"
          onChange={handleImageChange}
        />

        <CardFooter className="absolute bg-black/40 bottom-0 z-10 border-t-1 border-default-600 dark:border-default-100 w-full flex justify-between items-center gap-2 p-3">
          {isEditing ? (
            <>
              <Button
                color="default"
                radius="lg"
                size="sm"
                onPress={handleCancel}
              >
                <CancelIcon size={24} />
              </Button>
              <Button
                color="success"
                radius="lg"
                size="sm"
                onPress={handleSave}
              >
                <SaveIcon size={24} />
              </Button>
            </>
          ) : (
            <>
              <Popover
                showArrow
                backdrop="blur"
                isOpen={isPopoverOpen}
                placement="top"
                onOpenChange={(open) => setIsPopoverOpen(open)}
              >
                <PopoverTrigger>
                  <Button color="danger" radius="lg" size="sm">
                    <TrashIcon size={24} />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[220px] p-4 text-center">
                  <p className="text-sm mb-3">
                    Are you sure you want to delete this card?
                  </p>
                  <div className="flex justify-center gap-2">
                    <Button
                      size="sm"
                      variant="flat"
                      onPress={() => {
                        setIsPopoverOpen(false);
                      }}
                    >
                      Cancel
                    </Button>
                    <Button color="danger" size="sm" onPress={handleDelete}>
                      Delete
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
              <Button
                color="warning"
                radius="lg"
                size="sm"
                onPress={() => setIsEditing(true)}
              >
                <EditIcon size={24} />
              </Button>
            </>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
}

export default function EditPollishPage() {
  const { id } = useParams();
  const [pollishName, setPollishName] = useState<string>("Loading...");
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [cards, setCards] = useState<CardProps[]>([]);
  const [backgroundUrl, setBackgroundUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const [cardTitle, setCardTitle] = useState("");

  const handleRemoveBackground = async () => {
    try {
      // Call DELETE API with pollish_id as query param
      await axios.delete(`${api_gateway_url}/background`, {
        headers: { "x-api-key": api_gateway_key! },
        params: { pollish_id: id },
      });

      // Update UI state on success
      setBackgroundUrl(null);
    } catch (error) {
      // console.error("Failed to remove background", error);
      alert("Failed to remove background");
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];

    try {
      // 1. Get presigned URL from your API Gateway Lambda
      const presignResponse = await axios.post(
        `${api_gateway_url}/background`,
        {
          pollish_id: id,
          content_type: file.type,
        },
        {
          headers: { "x-api-key": api_gateway_key! },
        },
      );

      const { upload_url, object_url } = presignResponse.data;

      // 2. Upload file to S3 via presigned URL
      await axios.put(upload_url, file, {
        headers: { "Content-Type": file.type },
      });

      // 3. Update backgroundUrl state with new S3 URL
      setBackgroundUrl(object_url);

      // Optionally: call backend to save this new background URL metadata (not covered here)
    } catch (error) {
      // console.error("Upload failed", error);
      alert("Failed to upload background");
    }
  };

  const handleBackgroundAction = (key: Key) => {
    if (key === "remove") {
      handleRemoveBackground();
    }
    if (key === "change") {
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
        fileInputRef.current.click();
      }
    }
  };

  const handleShareAction = () => {
    onOpen();
  };

  const handleDeleteAction = async () => {
    if (
      !confirm(
        "Are you sure you want to delete this Pollish? This action cannot be undone.",
      )
    )
      return;

    try {
      await axios.delete(`${api_gateway_url}/delete`, {
        headers: { "x-api-key": api_gateway_key! },
        params: { pollish_id: id },
      });
      window.location.href = "/";
    } catch (error) {
      // console.error("Failed to delete Pollish", error);
      alert("Failed to delete Pollish");
    }
  };

  const handleNext = () => {
    if (cards.length === 0) return;
    const nextCards = [...cards.slice(1), cards[0]];

    setCards(nextCards);
  };

  const handleBack = () => {
    if (cards.length === 0) return;
    const backCards = [
      cards[cards.length - 1],
      ...cards.slice(0, cards.length - 1),
    ];

    setCards(backCards);
  };

  useEffect(() => {
    const url = window.location.href.replace(/\/edit$/, "");

    setShareUrl(url);

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

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div
      className="max-w-xl w-full p-2 text-center flex flex-col items-center gap-4 h-full rounded-lg z-10"
      style={{
        backgroundImage: backgroundUrl ? `url(${backgroundUrl})` : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <h1
        className={
          title({ color: "yellow", size: "lg" }) + " capitalize z-30 pb-2"
        }
      >
        {pollishName}
      </h1>
      <div className="grid place-items-center h-full z-10">
        {cards.length > 0 ? (
          cards
            .slice()
            .reverse()
            .map((card) => {
              return (
                <PollishCard
                  key={card.id}
                  cards={cards}
                  pollish_id={id as string}
                  props={card}
                  setCards={setCards}
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
              className="border-none bg-background/60 dark:bg-default-100/50 w-72 md:w-96 h-96 cursor-grab active:cursor-grabbing g z-20 p-12"
              shadow="sm"
              onPress={() => setIsPopoverOpen(true)}
            >
              <CardBody className="grid place-items-center h-full">
                <p className="text-center text-large font-medium">
                  Your cards go here
                </p>
              </CardBody>
            </Card>
          </motion.div>
        )}
      </div>
      <div className="w-full flex justify-center items-center gap-2">
        <input
          ref={fileInputRef}
          accept="image/*"
          style={{ display: "none" }}
          type="file"
          onChange={handleFileChange}
        />
        <Dropdown className="z-30">
          <DropdownTrigger>
            <Button color="default" radius="lg" size="md" variant="solid">
              Options
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            aria-label="Action event example"
            onAction={(key) => {
              if (key === "share") {
                handleShareAction();
              } else if (key === "delete") {
                handleDeleteAction();
              } else {
                handleBackgroundAction(key);
              }
            }}
          >
            <DropdownItem key="share">Share</DropdownItem>
            <DropdownItem key="change">
              {backgroundUrl ? "Change Background" : "Add Background"}
            </DropdownItem>
            <DropdownItem key="remove" className="text-warning" color="warning">
              Remove Background
            </DropdownItem>
            <DropdownItem key="delete" className="text-danger" color="danger">
              Delete Pollish
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
        <Button
          className="z-30"
          color="default"
          radius="lg"
          size="sm"
          onPress={handleBack}
        >
          {"<"}
        </Button>
        <Button
          className="z-30"
          color="default"
          radius="lg"
          size="sm"
          onPress={handleNext}
        >
          {">"}
        </Button>
        <Popover
          showArrow
          isOpen={isPopoverOpen}
          offset={10}
          placement="bottom"
          onOpenChange={(open) => setIsPopoverOpen(open)}
        >
          <PopoverTrigger>
            <Button
              className="z-30"
              color="primary"
              radius="lg"
              size="md"
              onPress={() => setIsPopoverOpen(true)}
            >
              Add
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[240px]">
            {(titleProps) => {
              const handleCreateCard = async () => {
                if (!cardTitle.trim()) return;

                try {
                  const response = await axios.post(
                    `${api_gateway_url}/card`,
                    {
                      pollish_id: id,
                      title: cardTitle,
                      value: 0,
                    },
                    {
                      headers: {
                        "x-api-key": api_gateway_key!,
                        "Content-Type": "application/json",
                      },
                    },
                  );

                  const newCard = response.data.card;

                  newCard.imageUrl = "/placeholder.png";
                  setCards((prev) => [newCard, ...prev]);
                  setCardTitle("");
                  setIsPopoverOpen(false);
                } catch (error) {
                  // console.error("Error creating card:", error);
                  alert("Failed to create card.");
                }
              };

              return (
                <div className="px-1 py-2 w-full">
                  <p
                    className="text-small font-bold text-foreground"
                    {...titleProps}
                  >
                    Add Card
                  </p>
                  <div className="mt-2 flex flex-col gap-2 w-full">
                    <Input
                      label="Card Title"
                      size="sm"
                      value={cardTitle}
                      variant="bordered"
                      onChange={(e) => setCardTitle(e.target.value)}
                    />
                    <Button
                      color="success"
                      size="sm"
                      onPress={handleCreateCard}
                    >
                      Create
                    </Button>
                  </div>
                </div>
              );
            }}
          </PopoverContent>
        </Popover>
      </div>
      <Modal backdrop="blur" isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex items-center justify-between">
                Share this Pollish
              </ModalHeader>

              <ModalBody>
                <div className="space-y-4">
                  {/* Copy Link */}
                  <Input
                    readOnly
                    endContent={
                      <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        onPress={handleCopy}
                      >
                        {copied ? (
                          <CheckIcon className="w-5 h-5 text-green-500" />
                        ) : (
                          <ClipboardIcon className="w-5 h-5" />
                        )}
                      </Button>
                    }
                    radius="md"
                    size="sm"
                    value={shareUrl}
                  />

                  {/* Other Share Options */}
                  <div className="flex gap-3 justify-center">
                    <Button
                      isIconOnly
                      variant="light"
                      onPress={() =>
                        window.open(
                          `sms:&body=Check out my Pollish: ${encodeURIComponent(shareUrl)}`,
                          "_blank",
                        )
                      }
                    >
                      <MessageCircleIcon />
                    </Button>

                    <Button
                      isIconOnly
                      variant="light"
                      onPress={() =>
                        window.open(
                          `mailto:?subject=Check out my Pollish&body=${encodeURIComponent(
                            shareUrl,
                          )}`,
                          "_blank",
                        )
                      }
                    >
                      <MailIcon />
                    </Button>
                  </div>
                </div>
              </ModalBody>

              <ModalFooter>
                <Button radius="lg" size="md" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  color="primary"
                  radius="lg"
                  size="md"
                  onPress={handleCopy}
                >
                  Copy Link
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
