function LineChart({ histogram }: { histogram: any[] }) {
  if (!histogram || !Array.isArray(histogram)) return null;

  return (
    <div className="mt-2 space-y-2">
      <div className="flex items-center gap-2">
        {/* Combined progress bar */}
        <div className="flex-1 bg-gray-200 rounded-full h-2.5 flex overflow-hidden">
          {histogram.map((bin, index) => (
            <div
              key={index}
              className={`h-2.5 ${
                index === 0
                  ? "bg-green-500"
                  : index === 1
                  ? "bg-orange-400"
                  : "bg-red-500"
              }`}
              style={{ width: `${bin.density * 100}%` }}
            />
          ))}
        </div>
      </div>

      {/* Legend showing each bin */}
      <div className="flex flex-wrap gap-4 text-sm">
        {histogram.map((bin, index) => (
          <div key={index} className="flex items-center gap-2">
            <div
              className={`w-3 h-3 rounded-sm ${
                index === 0
                  ? "bg-green-500"
                  : index === 1
                  ? "bg-orange-400"
                  : "bg-red-500"
              }`}
            />
            <span className="text-muted-foreground">
              {bin.start}
              {bin.end ? `-${bin.end}` : "+"}
            </span>
            <span className="font-medium">{bin.density * 100}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default LineChart;
