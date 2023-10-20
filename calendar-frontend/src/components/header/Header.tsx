type HeaderProps = {
  title: string;
};

export const Header = (props: HeaderProps) => {
  return (
    <>
      <header className="py-5 bg-gray-200 flex flex-row align-middle justify-center">
        <h1 className="text-2xl">{props.title}</h1>
      </header>
    </>
  );
};

export default Header;
