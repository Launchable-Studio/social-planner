"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useProjects } from "@/lib/hooks/useProjects";
import Link from "next/link";

export default function Home() {
  const { data: projects, isLoading } = useProjects();

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-2xl font-semibold text-center">Loading...</p>
      </main>
    );
  }

  if (!projects) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-2xl font-semibold text-center">No projects found</p>
      </main>
    );
  }

  return (
    <div className="flex flex-col items-center justify-start min-h-screen gap-12 p-12">
      <h1 className="text-2xl font-semibold">Projects</h1>
      <div className="flex flex-wrap justify-center w-full gap-4">
        {projects.map((project) => (
          <Card key={project.slug}>
            <CardHeader>
              <h2 className="text-xl font-semibold">{project.slug}</h2>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <Link href={`/${project.slug}/instagram`}>
                  <Button variant="default">Instagram</Button>
                </Link>
                <Link href={`/${project.slug}/youtube`} aria-disabled disabled>
                  <Button variant="default" disabled>
                    YouTube
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
