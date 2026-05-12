interface PakistanMapProps {
  data?: Array<{
    city: string;
    count: number;
    highSeverity: number;
    mediumSeverity: number;
    lowSeverity: number;
  }>;
}

export function PakistanMap({ data }: PakistanMapProps) {
  // City coordinates and sample data
  const cities = [
    { name: "Karachi", x: 25, y: 75, count: 45, severity: "high" },
    { name: "Lahore", x: 45, y: 35, count: 28, severity: "medium" },
    { name: "Islamabad", x: 50, y: 25, count: 12, severity: "low" },
    { name: "Rawalpindi", x: 48, y: 28, count: 15, severity: "low" },
    { name: "Faisalabad", x: 60, y: 45, count: 22, severity: "medium" },
    { name: "Multan", x: 55, y: 60, count: 35, severity: "high" },
    { name: "Hyderabad", x: 35, y: 70, count: 18, severity: "medium" },
    { name: "Sukkur", x: 40, y: 55, count: 8, severity: "low" },
  ];

  const getMarkerSize = (count: number) => {
    if (count >= 30) return "w-4 h-4";
    if (count >= 15) return "w-3 h-3";
    return "w-2 h-2";
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high": return "bg-red-500";
      case "medium": return "bg-amber-500";
      case "low": return "bg-green-500";
      default: return "bg-slate-500";
    }
  };

  return (
    <div className="relative h-96 bg-gradient-to-b from-blue-50 to-green-50 rounded-lg border-2 border-slate-200 overflow-hidden" data-testid="map-pakistan">
      {/* Map background representing Pakistan */}
      <div className="absolute inset-0 opacity-20">
        <svg viewBox="0 0 400 300" className="w-full h-full">
          <path 
            d="M50,50 Q200,30 350,80 Q380,120 350,180 Q300,250 200,260 Q100,250 50,200 Q20,150 50,50 Z" 
            fill="hsl(var(--primary))" 
            stroke="hsl(var(--primary))" 
            strokeWidth="2"
          />
        </svg>
      </div>
      
      {/* City markers */}
      {cities.map((city, index) => (
        <div
          key={index}
          className="absolute transform -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${city.x}%`, top: `${city.y}%` }}
          data-testid={`marker-${city.name.toLowerCase()}`}
        >
          <div className={`${getMarkerSize(city.count)} ${getSeverityColor(city.severity)} rounded-full`}></div>
          <div className="text-xs font-medium text-slate-700 mt-1 whitespace-nowrap">
            {city.name}
          </div>
        </div>
      ))}
      
      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white bg-opacity-90 p-3 rounded-lg" data-testid="map-legend">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-xs text-slate-700">High Risk (30+ cases)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
            <span className="text-xs text-slate-700">Medium Risk (15-29 cases)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-xs text-slate-700">Low Risk (&lt;15 cases)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
