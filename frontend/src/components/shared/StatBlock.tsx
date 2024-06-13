type StabBlockProps = {
  value: string | number;
  label: string;
};

const StatBlock = ({ value, label }: StabBlockProps) => (
  <div className="flex-center gap-2">
    <p className="small-semibold lg:body-bold text-primary-500">{value}</p>
    <p className="small-medium lg:base-medium text-light-2">
      {value == 1 ? `${label}` : `${label}s`}
    </p>
  </div>
);

export default StatBlock;
