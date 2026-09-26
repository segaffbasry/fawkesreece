import { Shell } from "@/components/chrome";
import { Loader } from "@/components/Loader";
import { Band } from "@/components/home/Band";
import { Hero } from "@/components/home/Hero";
import { Jobs } from "@/components/home/Jobs";
import { Reasons } from "@/components/home/Reasons";
import { Sectors } from "@/components/home/Sectors";
import { Testimonials } from "@/components/home/Testimonials";
import { Trusted } from "@/components/home/Trusted";
import { Values } from "@/components/home/Values";
import { WhatWeDo } from "@/components/home/WhatWeDo";

export default function Home() {
  return <>
    <Loader />
    <Shell>
      <Hero />
      <Trusted />
      <WhatWeDo />
      <Jobs />
      <Sectors />
      <Band />
      <Values />
      <Reasons />
      <Testimonials />
    </Shell>
  </>;
}
