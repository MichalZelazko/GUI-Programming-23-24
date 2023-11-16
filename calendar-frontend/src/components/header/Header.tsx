type HeaderProps = {
  title: string;
  header?: boolean;
};

export const Header = (props: HeaderProps) => {
  return (
    <>
      <header
        className={`bg-white flex-row align-middle justify-center border-b border-b-gray-200 font-sans ${
          props.header ? "flex md:hidden py-2" : "flex py-5"
        }`}
      >
        <h1 className={`${props.header ? "text-lg" : "text-3xl"}`}>
          {props.title}
        </h1>
      </header>
    </>
  );
};

export default Header;
