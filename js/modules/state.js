export const state = {
  theme: localStorage.getItem("theme") || "dark",
  activeTag: "All",
  searchQuery: "",
  currentPostId: null,
};

export default state;
