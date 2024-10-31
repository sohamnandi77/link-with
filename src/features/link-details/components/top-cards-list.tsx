import TopCard from "./top-card";

const TOP_CARD_LIST = [
  {
    key: "total_clicks",
    title: "Total Clicks",
  },
  {
    key: "unique_clicks",
    title: "Unique Clicks",
  },
  {
    key: "top_country",
    title: "Top Country",
  },
  {
    key: "top_source",
    title: "Top Source",
  },
];

const TopCardsList = () => {
  return (
    <div className="flex w-full items-center justify-between space-x-4">
      {TOP_CARD_LIST.map((card) => {
        return <TopCard key={card.key} title={card.title} value="100" />;
      })}
    </div>
  );
};

export default TopCardsList;
