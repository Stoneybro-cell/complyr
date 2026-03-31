"use client";
import React from "react";

export function DocsLogo() {
  return (
    <div 
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        window.location.href = '/';
      }}
      className="flex items-center gap-2 cursor-pointer"
    >
      <img
        alt="COMPLYR Logo"
        className="h-6 w-auto block dark:hidden"
        src="/complyrlogo-dark.svg"
      />
      <img
        alt="COMPLYR Logo"
        className="h-6 w-auto hidden dark:block"
        src="/complyrlogo-light.svg"
      />
      <span className="font-bold uppercase tracking-tight text-lg text-black dark:text-white">Complyr</span>
    </div>
  );
}
