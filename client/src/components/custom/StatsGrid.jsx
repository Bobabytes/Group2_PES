import StatsCard from "./StatsCard";


const StatsGrid = ({ stats }) => {
  return (
    <div className="stats-grid">
      {stats.map((stat, index) => (
        <StatsCard
          key={index}
          title={stat.title}
          value={stat.value}
          description={stat.description}
          icon={stat.icon}
          borderColor={stat.borderColor}
          iconColor={stat.iconColor}
        />
      ))}
    </div>
  );
};

export default StatsGrid;
