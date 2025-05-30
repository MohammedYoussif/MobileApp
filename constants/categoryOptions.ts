const categoryOptions: Record<
  CategoryOptionsTypes,
  { id: number; name: string }[]
> = {
  sort: [
    {
      id: 0,
      name: "Rate(low to high)",
    },
    {
      id: 1,
      name: "Rate(high to low)",
    },
  ],
  filter: [
    {
      id: 0,
      name: "Company",
    },
    {
      id: 1,
      name: "Person",
    },
  ],
  empty: [],
};

export enum CategoryOptionsTypes {
  SORT = "sort",
  FILTER = "filter",
  EMPTY = "empty",
}

export default categoryOptions;
