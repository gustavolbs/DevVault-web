"use client";

import * as Accordion from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";

export function FAQ({ items }: { items: { question: string; answer: string }[] }) {
  return <Accordion.Root type="single" collapsible className="divide-y divide-border border-y border-border">
    {items.map((item, index) => <Accordion.Item value={`item-${index}`} key={item.question}>
      <Accordion.Header><Accordion.Trigger className="group flex w-full items-center justify-between py-5 text-left text-sm font-semibold"><span>{item.question}</span><ChevronDown className="size-4 shrink-0 text-muted-foreground transition group-data-[state=open]:rotate-180" /></Accordion.Trigger></Accordion.Header>
      <Accordion.Content className="overflow-hidden text-sm leading-6 text-muted-foreground data-[state=closed]:animate-none"><p className="pb-5 pr-8">{item.answer}</p></Accordion.Content>
    </Accordion.Item>)}
  </Accordion.Root>;
}
