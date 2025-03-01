"use client";

import React from "react";
import {Card, CardFooter, CardHeader} from "../ui/card";
import {Header} from "./header";
import {Social} from "./social";

interface CardWrapperProps {
  headerLabel: string;
  showSocial?: boolean;
}

export const CardWrapper = ({
  headerLabel,
  showSocial = false,
}: CardWrapperProps) => {
  return (
    <Card className="w-[400px] shadow-md mx-4">
      <CardHeader>
        <Header label={headerLabel} />
      </CardHeader>
      {showSocial && (
        <CardFooter>
          <Social />
        </CardFooter>
      )}
    </Card>
  );
};
