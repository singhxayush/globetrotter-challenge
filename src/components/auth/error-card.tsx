import React from "react";
import {CardWrapper} from "./card-wrapper";
import {FaExclamationTriangle} from "react-icons/fa";

export const ErrorCard = () => {
  return (
    <CardWrapper
      headerLabel="Oops! something went wrong"
      backButtonHref="/auth/login"
      backButtonLabel="Back to login"
    >
      <div className="w-full flex items-center justify-center">
        <FaExclamationTriangle className="w-10 h-10"/>
      </div>
    </CardWrapper>
  );
};
