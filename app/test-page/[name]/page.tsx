import Renderer from "../../components/_renderer/Renderer";

type Props = {
  params: Promise<{
    name: string;
  }>;
};

export default async function TestPage({ params }: Readonly<Props>) {
  const { name } = await params;

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <Renderer projectName={name} />
      </main>
    </div>
  );
}
