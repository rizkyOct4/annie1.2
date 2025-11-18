interface Props {
  notification: React.ReactNode;
  statics: React.ReactNode;
  trending: React.ReactNode;
}

const HomepageLayout = ({ notification, statics, trending }: Props) => {
  return (
    <div className="w-[100%] h-auto">
      <section className="w-[100%] h-auto flex flex-wrap overflow-hidden">
        <div className="relative w-[70%] max-h-[400px] overflow-y-auto bg-blue-400">
          {statics}
        </div>
        <div className="w-[30%]">
          <div className="bg-white text-black h-[200px] flex justify-start p-4">
            {notification}
          </div>
          <div className="bg-red-500 h-[200px] flex-center">{trending}</div>
        </div>
      </section>
    </div>
  );
};

export default HomepageLayout;

// todo selesaikn besok sama kau pararel routes 1!!!
