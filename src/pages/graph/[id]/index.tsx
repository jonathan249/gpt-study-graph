import React, { useEffect } from "react";
import type { NextPage } from "next";
import { useParams, notFound } from "next/navigation";
import { api } from "~/utils";

import { GraphCanvas, darkTheme } from "reagraph";
import type { Edge, Node } from "@prisma/client";

const GraphView: NextPage = () => {
  const params = useParams();
  const { data: notebook, isLoading } = api.notebook.byId.useQuery({
    id: params?.id as string,
  });

  if (isLoading) {
    return <div>Loading your Thoughts</div>;
  }

  if (!notebook) notFound();

  function Graph({ nodes, edges }: { nodes: Node[]; edges: Edge[] }) {
    return (
      <div className="block">
        <GraphCanvas nodes={nodes} edges={edges} animated theme={darkTheme} />
      </div>
    );
  }

  return (
    <div className="flex h-full w-full flex-col overflow-y-hidden">
      <nav className="sticky top-0 z-50 flex h-16 w-full items-center bg-slate-950 p-5">
        {notebook.title}
      </nav>
      <Graph nodes={notebook.nodes} edges={notebook.edges} />
    </div>
  );
};

export default GraphView;
