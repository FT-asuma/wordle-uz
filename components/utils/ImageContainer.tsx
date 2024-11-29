"use client"
import React from "react";
import Image from "next/image";
import { PixabayImage } from "@/constants/interface";
const ImageContainer = ({i}: {
    i: PixabayImage
}) => {
  return (
    <div>
      <Image src={i.userImageURL} alt={i.tags[0]} width={100} height={100} />
    </div>
  );
};

export default ImageContainer;
