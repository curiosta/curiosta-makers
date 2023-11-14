import Typography from "../Typography";

const Snapshot = () => {
  const itemsSnapshots = [
    {
      issuedItems: 345,
      requestIssuedRatio: "95%",
      damageItems: 17,
    },
  ];

  const usersSnapshots = [
    {
      issuedUsers: 21,
      avgHoursSpend: 7,
      avgItemsByUsers: 15,
    },
  ];

  const defaultDate = new Date().toLocaleDateString("en-CA");

  return (
    <div className="w-full mb-12">
      <Typography>Snapshot</Typography>
      <div className="flex gap-8 py-2 my-2 overflow-x-auto">
        {itemsSnapshots.map((Snapshot) => (
          <div className="bg-secondary p-4 shadow-lg rounded-2xl">
            <input type="date" name="date" value={defaultDate} />
            <div className="flex justify-between items-center gap-2 p-2 border-b">
              <Typography size="h4/normal">{Snapshot.issuedItems}</Typography>
              <Typography size="body2/normal">
                Number of items issued
              </Typography>
            </div>
            <div className="flex justify-between items-center gap-2 p-2 border-b">
              <Typography size="h4/normal">
                {Snapshot.requestIssuedRatio}
              </Typography>
              <Typography size="body2/normal">
                Request to Issue Ratio
              </Typography>
            </div>
            <div className="flex items-center gap-2 p-2 border-b">
              <Typography size="h4/normal">{Snapshot.damageItems}</Typography>
              <Typography size="body2/normal">Number of damages</Typography>
            </div>
          </div>
        ))}
        {usersSnapshots.map((Snapshot) => (
          <div className="bg-secondary p-4 shadow-lg rounded-2xl">
            <input type="date" name="date" value={defaultDate} />
            <div className="flex justify-between items-center gap-2 p-2 border-b">
              <Typography size="h4/normal">{Snapshot.issuedUsers}</Typography>
              <Typography size="body2/normal">Number of user issue</Typography>
            </div>
            <div className="flex justify-between items-center gap-2 p-2 border-b">
              <Typography size="h4/normal">{Snapshot.avgHoursSpend}</Typography>
              <Typography size="body2/normal">Avg hours spent</Typography>
            </div>
            <div className="flex justify-between items-center gap-2 p-2 border-b">
              <Typography size="h4/normal">
                {Snapshot.avgItemsByUsers}
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

export default Snapshot;
