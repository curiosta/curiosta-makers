import Typography from "../Typography";

const Snapshort = () => {
  const itemsSnapshorts = [
    {
      issuedItems: 345,
      requestIssuedRatio: "95%",
      damageItems: 17,
    },
  ];

  const usersSnapshorts = [
    {
      issuedUsers: 21,
      avgHoursSpend: 7,
      avgItemsByUsers: 15,
    },
  ];

  const defaultDate = new Date().toLocaleDateString("en-CA");

  return (
    <div className="w-full mb-12">
      <Typography>Snapshort</Typography>
      <div className="flex gap-8 py-2 my-2 overflow-x-auto">
        {itemsSnapshorts.map((snapshort) => (
          <div className="bg-secondray p-4 shadow-lg rounded-2xl">
            <input type="date" name="date" value={defaultDate} />
            <div className="flex justify-between items-center gap-2 p-2 border-b">
              <Typography size="h4/normal">{snapshort.issuedItems}</Typography>
              <Typography size="body2/normal">
                Number of items issued
              </Typography>
            </div>
            <div className="flex justify-between items-center gap-2 p-2 border-b">
              <Typography size="h4/normal">
                {snapshort.requestIssuedRatio}
              </Typography>
              <Typography size="body2/normal">
                Request to Issue Ratio
              </Typography>
            </div>
            <div className="flex items-center gap-2 p-2 border-b">
              <Typography size="h4/normal">{snapshort.damageItems}</Typography>
              <Typography size="body2/normal">Number of damages</Typography>
            </div>
          </div>
        ))}
        {usersSnapshorts.map((snapshort) => (
          <div className="bg-secondray p-4 shadow-lg rounded-2xl">
            <input type="date" name="date" value={defaultDate} />
            <div className="flex justify-between items-center gap-2 p-2 border-b">
              <Typography size="h4/normal">{snapshort.issuedUsers}</Typography>
              <Typography size="body2/normal">Number of user issue</Typography>
            </div>
            <div className="flex justify-between items-center gap-2 p-2 border-b">
              <Typography size="h4/normal">
                {snapshort.avgHoursSpend}
              </Typography>
              <Typography size="body2/normal">Avg hours spent</Typography>
            </div>
            <div className="flex justify-between items-center gap-2 p-2 border-b">
              <Typography size="h4/normal">
                {snapshort.avgItemsByUsers}
              </Typography>
              <Typography size="body2/normal">
                Avg. number of items issued per user
              </Typography>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Snapshort;
