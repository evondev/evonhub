export interface PartnerProps {}

export async function Partner(_props: PartnerProps) {
  const PARTNERS = [
    {
      name: "Mayashare",
      link: "https://vncreatorpreneur.com/",
    },
    {
      name: "Evondev",
      link: "https://evondev.com/",
    },
  ];
  return (
    <div className="p-5 rounded-xl bgDarkMode flex flex-col gap-5 w-full">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-base lg:text-lg">🤝 Partnership</h3>
      </div>
      <div className="flex flex-col gap-3">
        {PARTNERS.map((partner, index) => (
          <div className="flex items-center gap-2 font-medium" key={index}>
            <div className="size-3 bg-primary"></div>
            <a
              href={partner.link}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-primary"
            >
              {partner.name}
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
