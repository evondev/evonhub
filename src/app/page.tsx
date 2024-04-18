import Card from "@/components/Card";

export default function Home() {
  return (
    <>
      <div className="main grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-5">
        <Card></Card>
        <Card></Card>
        <Card></Card>
      </div>
    </>
  );
}
