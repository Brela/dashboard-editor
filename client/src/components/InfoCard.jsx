const InfoCard = ({ type, message, forever }) => {
  const [showInfoCard, setShowInfoCard] = useState(false);

  useEffect(() => {
    if (message !== "") {
      setShowInfoCard(true);
      if (!forever) {
        setTimeout(() => {
          setShowInfoCard(false);
        }, 10000);
      }
    } else {
      setShowInfoCard(false);
    }
  }, [message]);

  const types = {
    success: "green",
    error: "red",
    info: "purple",
  };
  const borderType = `${
    (types[type] === "red" && "border-red-300") ||
    (types[type] === "green" && "border-green-300") ||
    (types[type] === "purple" && "border-purple-300") ||
    "border-green-300"
  }`;
  const backgroundType = `${
    (types[type] === "red" && "bg-red-50") ||
    (types[type] === "green" && "bg-green-50") ||
    (types[type] === "purple" && "bg-purple-50") ||
    "bg-green-50"
  }`;
  const textType = `${
    (types[type] === "red" && "text-red-500") ||
    (types[type] === "green" && "text-green-500") ||
    (types[type] === "purple" && "text-purple-500") ||
    "text-green-500"
  }`;

  return (
    <div
      className={`rounded-lg border ${borderType} ${backgroundType} mt-2 p-3 shadow-lg ${
        (!showInfoCard && "hidden") || ""
      }`}
    >
      <div className="flex items-center space-x-2">
        <div>
          {type === "success" && (
            <CheckIcon className={`h-6 w-6 ${textType}`} />
          )}
          {type === "error" && <XMarkIcon className={`h-6 w-6 ${textType}`} />}
          {type === "info" && (
            <ExclamationCircleIcon className={`h-6 w-6 ${textType}`} />
          )}
        </div>
        <div className="">
          <span
            className="block"
            style={{
              color: `black`,
            }}
          >
            {message}
          </span>
        </div>
      </div>
    </div>
  );
};

export default InfoCard;
