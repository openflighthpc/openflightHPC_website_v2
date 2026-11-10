
import { getProject } from "@/lib/projects-handler";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type RendererProps = {
  projectName: string;
  StencilText?: React.FC<{ text: string; repeat?: number }>;
};

const STATUS_TAGS = {
  active: "LIVE ON RACK",
  complete: "COOLING DOWN",
  archived: "FROZEN IN TAPE",
} as const;

const STATUS_COLOR = {
  active: "text-lime-300 border-lime-400/30 bg-lime-400/5",
  complete: "text-lime-500 border-lime-500/20 bg-lime-500/5",
  archived: "text-neutral-400 border-neutral-600 bg-neutral-900",
} as const;

const NODE_LABELS = [
  "NODE",
  "JOB",
  "TAPE",
  "RACK",
  "PORT",
  "ECHO",
  "MOOR",
  "FLUX",
];

export default function Renderer({
  projectName,
  StencilText,
}: Readonly<RendererProps>) {
  const project = getProject(projectName);
  const markdownString = project.page;
  const stamp =
    STATUS_TAGS[project.status as keyof typeof STATUS_TAGS] ?? project.status;
  const stampColor =
    STATUS_COLOR[project.status as keyof typeof STATUS_COLOR] ??
    STATUS_COLOR.archived;
  const stampAngle = ((project.name.length * 7) % 15) - 7;
  const seed = project.name.length;

  return (
    <div className="relative min-h-screen font-sans text-neutral-100">
      {/* ————————————————————————————————————————
          BACKDROP — the wall behind everything:
          poured concrete, one warm seam, node-rack
          labels stencilled up the dark
          ———————————————————————————————————————— */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <div className="absolute inset-0 bg-neutral-950" />

        {Array.from({ length: 36 }).map((_, i) => {
          const col = i % 6;
          const row = (i / 6) | 0; // 0 = bright, 5 = deep dark
          const left = 4 + col * 17 + ((seed * (i + 3)) % 9);
          const top = 5 + row * 13 + ((seed * (i + 5)) % 11);
          const opacity = 0.38 - row * 0.055;
          const scale = 0.9 + row * 0.04;
          const label = `${NODE_LABELS[(i + seed) % NODE_LABELS.length]}-${((seed * 31 + i * (17 + col * 13)) % 9000) + 1000
            }`;

          return (
            <div
              key={i}
              className="absolute font-mono text-[10px] uppercase tracking-[0.35em] text-neutral-400"
              style={{
                left: `${left}%`,
                top: `${top}%`,
                opacity,
                transform: `scale(${scale})`,
              }}
            >
              {label}
            </div>
          );
        })}

        <div className="absolute left-0 right-[22%] top-[17%] h-px bg-neutral-800/50" />
        <div className="absolute bottom-[14rem] left-[26%] right-0 h-px bg-neutral-800/40" />
        <div className="absolute bottom-[7rem] left-[38%] right-0 h-px bg-neutral-800/30" />
      </div>

      {/* ————————————————————————————————————————
          HEADER — dossier stamp, path breadcrumb,
          the specimen title and its meta strip
          ———————————————————————————————————————— */}
      <header className="relative mx-auto max-w-4xl px-6 pb-4 pt-20 sm:px-10">
        <div className="flex items-start justify-between">
          <div className="font-mono text-[10px] uppercase tracking-[0.35em] text-neutral-500">
            /projects/&gt;{projectName}
          </div>

          <div
            className={`select-none border px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.3em] ${stampColor}`}
            style={{ transform: `rotate(${stampAngle}deg)` }}
          >
            {stamp}
          </div>
        </div>

        <div className="mt-10">
          {project.description ? (
            <p className="max-w-2xl font-serif text-xl italic leading-relaxed text-neutral-300">
              {project.description}
            </p>
          ) : (
            <p className="font-mono text-[11px] uppercase tracking-[0.35em] text-neutral-600">
              description on file — see exhibit below
            </p>
          )}

          <h1 className="mt-6 font-serif text-5xl font-bold leading-[1.05] tracking-tight text-white sm:text-6xl">
            {project.name}
          </h1>

          <div className="mt-8 flex flex-wrap gap-2 font-mono text-[10px] uppercase tracking-[0.3em]">
            {[
              { label: "status", value: project.status },
              { label: "featured", value: project.featured ? "yes" : "no" },
              { label: "langs", value: project.languages.join(" · ") },
              { label: "tags", value: project.tags.join(" · ") },
            ].map((m) => (
              <div
                key={m.label}
                className="border border-neutral-800 bg-neutral-900/60 px-3 py-2"
              >
                <span className="text-neutral-500">{m.label}</span>
                <span className="mx-2 text-neutral-700">/</span>
                <span className="text-neutral-100">{m.value}</span>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* ————————————————————————————————————————
          STENCIL — row of repeated name stamps
          ———————————————————————————————————————— */}
      {StencilText && (
        <div className="relative mx-auto max-w-4xl px-6 pb-2 pt-14 sm:px-10">
          <StencilText text={`${project.name} specimen`} repeat={3} />
        </div>
      )}

      {/* ————————————————————————————————————————
          BODY — the reading column, with a vertical
          "rack door" rail note down the left margin
          ———————————————————————————————————————— */}
      <main className="relative mx-auto max-w-4xl px-6 sm:px-10">
        <div className="grid grid-cols-1 gap-y-16 py-20 text-lg leading-loose [grid-template-columns:1fr] lg:text-xl lg:[grid-template-columns:3rem_minmax(0,1fr)] lg:gap-x-10">
          <aside className="hidden lg:block">
            <div className="sticky top-24 mt-2 font-mono text-[10px] uppercase tracking-[0.4em] text-neutral-600 [writing-mode:vertical-rl]">
              reading log — open rack door
            </div>
          </aside>

          <div className="prose prose-invert max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                img({ src, alt }) {
                  if (typeof src !== "string") return null;

                  const resolvedSrc = resolveImagePath(src, projectName);

                  return (
                    <Image
                      src={resolvedSrc}
                      alt={alt || ""}
                      width={1200}
                      height={800}
                      className="grayscale-[35%] max-w-full h-auto rounded-sm"
                      sizes="(max-width: 768px) 100vw, 768px"
                    />
                  );
                },
              }}
            >
              {markdownString}
            </ReactMarkdown>
          </div>
        </div>
      </main>

      {/* ————————————————————————————————————————
          FOOTER — the corridor ends here
          ———————————————————————————————————————— */}
      <footer className="relative border-t border-neutral-800/70">
        <div className="mx-auto flex max-w-4xl flex-col gap-4 px-6 py-12 font-mono text-[10px] uppercase tracking-[0.35em] text-neutral-500 sm:px-10">
          <div>
            floor {Math.max(1, Math.ceil(project.name.length / 2))} — end of
            corridor
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span>openflight hpc / specimen files</span>
            <span>do not feed after midnight</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

function resolveImagePath(src: string, projectName: string) {
  if (
    src.startsWith("https://") ||
    src.startsWith("http://") ||
    src.startsWith("/")
  ) {
    return src;
  }

  // Change based on where project files are
  return `/openflightHPC_website_v2/projects/${encodeURIComponent(projectName)}/${src.replace(/^\.\//, "")}`;
}
