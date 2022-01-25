const getMenuFrontend = (role = "USER_ROLE") => {
  const menu = [
    {
      title: "Dashboards",
      icon: "mdi mdi-gauge",
      submenu: [
        { title: "Main", path: "/" },
        { title: "Progress", path: "progress" },
        { title: "Charts", path: "charts" },
      ],
    },
    {
      title: "Data",
      icon: "mdi mdi-folder-lock-open",
      submenu: [
        { title: "Doctors", path: "doctors" },
        { title: "Hospitals", path: "hospitals" },
      ],
    },
  ];

  if (role === "ADMIN_ROLE") {
    menu[1].submenu.unshift({ title: "Users", path: "users" });
  }

  return menu;
};

module.exports = { getMenuFrontend };
