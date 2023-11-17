type HeaderProps = {
  title: string;
  header?: boolean;
};

export const Header = (props: HeaderProps) => {
  return (
    <>
      <header
        className={`bg-[#8b3c38] text-white font-semibold flex-row align-middle justify-center border-b border-b-gray-200 ${
          props.header ? "flex md:hidden py-2" : "flex py-6"
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
