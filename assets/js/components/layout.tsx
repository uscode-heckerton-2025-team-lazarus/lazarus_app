import React from "react";
import { usePage, Link } from "@inertiajs/react";
import { ArrowRight, Shield } from "lucide-react";

import FlashMessage from "../components/flash_message";

export default function Layout({ children }) {
  const page = usePage();
  const flash: any = page.props.flash;
  const user: any = page.props.user;

  return (
    <>
      <div className="min-h-screen w-full bg-gray-50">
        {flash?.info && <FlashMessage type="info" message={flash.info} />}
        {flash?.error && <FlashMessage type="error" message={flash.error} />}
        {flash?.warning && (
          <FlashMessage type="warning" message={flash.warning} />
        )}
        {flash?.success && (
          <FlashMessage type="success" message={flash.success} />
        )}
        {children}
      </div>
    </>
  );
}
