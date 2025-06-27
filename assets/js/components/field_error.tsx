import React from "react";

interface FieldErrorProps {
  error?: string;
}

export const FieldError = ({ error }: FieldErrorProps) => {
  if (!error) {
    return null;
  }
  return <span className="error-message">{error}</span>;
};
