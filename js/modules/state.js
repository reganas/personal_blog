export const state = {
  theme: localStorage.getItem("theme") || "light",
  activeTag: "All",
  searchQuery: "",
  currentPostId: null,
};

export default state;
