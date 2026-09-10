import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, LogOut, Mail } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import interiorImage from "@/assets/cafe-interior.jpg";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — Food Therapy" },
      {
        name: "description",
        content:
          "Sign in to Food Therapy to save your details, track your orders and book your favourite table faster.",
      },
      { property: "og:title", content: "Sign in — Food Therapy" },
      { property: "og:description", content: "Save your details and order faster at Food Therapy." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AuthPage;
});

function AuthPage() {
  return null;
}
