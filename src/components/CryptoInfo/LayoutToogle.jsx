const LayoutToggle = ({ gridLayout, setGridLayout }) => {
  return (
    <div className="flex w-full px-8">
      <button
        className={`w-1/2 border-b-2 ${gridLayout ? 'border-blue-500 text-blue-500' : 'border-transparent '}`}
        onClick={() => setGridLayout(true)}
      >
        Grid
      </button>
      <button
        className={`w-1/2 border-b-2 ${!gridLayout ? 'border-blue-500 text-blue-500' : 'border-transparent '}`}
        onClick={() => setGridLayout(false)}
      >
        List
      </button>
    </div>
  );
};

export default LayoutToggle;
