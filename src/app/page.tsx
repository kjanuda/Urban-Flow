'use client';

import HomePage from "./Components/page";

import Benifit from "./Components/Benifits/page"
import Definition from "./Components/Definition/page"
import Solution from "./Components/Solution/page"
import Implementations from "./Components/Implementations/page"
import Challenge from "./Components/Challenge/page"

export default function Page() {
  return (
    <>
      <HomePage />
      <Benifit />
      <Definition />
      <Solution />
      <Implementations />
      <Challenge />
    </>
  );
}
