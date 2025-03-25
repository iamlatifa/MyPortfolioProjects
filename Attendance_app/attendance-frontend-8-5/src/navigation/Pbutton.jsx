import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Typography,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Avatar,
} from "@material-tailwind/react";
import { ChevronDownIcon } from "@heroicons/react/solid";

const profileMenuItems = [
  {
    label: "Visite Votre Profile",
    href: "/profile",
  },
  {
    label: "Déconnexion",
    href: "/logout",
  },
];

export default function ProfileMenu  (props)  {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const navigate = useNavigate();

  const closeMenu = () => setIsMenuOpen(false);
  const handleSignOut = () => {
    navigate("/logout");

  };
  const handelProfile = () =>{
    navigate("/profile");

  }
  return (
    <Menu open={isMenuOpen} handler={setIsMenuOpen} placement="bottom-end">
      <MenuHandler>
        <Button
          variant="text"
          className="flex font-normal text-gray-900 text-md font-medium items-center gap-1 rounded-full py-0.5 p-2 lg:ml-auto focus:outline-none"
        >
          {props.user.nom} {props.user.prenom}
          <Avatar
            withBorder={true}
            size="md"
            alt="candice wu"
            className="w-9 h-auto"
            src="user-icon.png"
          />
          <ChevronDownIcon
            strokeWidth={2.5}
            className={`h-3 w-3 transition-transform ${
              isMenuOpen ? "rotate-180" : ""
            }`}
          />
        </Button>
      </MenuHandler>
      <MenuList className="p-2">
        {profileMenuItems.map(({ label, href }) => {
          return (
            <MenuItem
              key={label}
              onClick={label === "Déconnexion" ? handleSignOut : handelProfile}
              className="flex items-center px-4 gap-2 rounded focus:outline-none"
            >
               <Typography
                as="span"
                variant="larg"
                className="font-normal"
                color={"inherit"}
              >
                {label}
              </Typography>
            </MenuItem>
          );
        })}
      </MenuList>
    </Menu>
  );
};
