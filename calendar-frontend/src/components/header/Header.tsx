type HeaderProps = {
  title: string;
};

export const Header = (props: HeaderProps) => {
  return (
    <>
      <header className="py-5 bg-white flex flex-row align-middle justify-center border-b border-b-gray-200 font-sans">
        <h1 className="text-[1.75rem]">{props.title}</h1>
      </header>
    </>
  );
};

export default Header;
