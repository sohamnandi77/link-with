import HomeLink from "./home-link";

export async function MainNav({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-16 items-center justify-between">
      <div className="flex items-center">
        <HomeLink />
      </div>
      <div>{children}</div>
    </div>
  );
}
