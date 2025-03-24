import React from "react";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import { useMediaQuery, useTheme } from "@mui/material";

const CustomBreadcrumbs = ({
  homeLink,
  dcName,
  type,
  parentMedicineType,
  medicineTypeName,
}) => {
  const theme = useTheme();
  const isPhone = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Breadcrumbs
      aria-label="breadcrumb"
      sx={{
        mb: isPhone ? 0 : 0,               // Adjust bottom margin for phone vs desktop
        p: isPhone ? "8px" : "16px",        // Proper padding for phone vs desktop
        fontSize: isPhone ? "0.8rem" : "1rem", // Responsive font size
        backgroundColor: "#f0f0f0",         // Updated background color
        borderRadius: "4px",               // Optional: add border radius for smoother edges

      }}
    >
      <Link
        underline="hover"
        color="inherit"
        href={homeLink}
        sx={{ fontSize: isPhone ? "0.8rem" : "inherit" }}
      >
        Home
      </Link>
      <Link
        underline="hover"
        color="inherit"
        href={`/searchcures/${dcName}`}
        sx={{ fontSize: isPhone ? "0.8rem" : "inherit" }}
      >
        {dcName}
      </Link>
      <Link
        underline="hover"
        color="inherit"
        href="#"
        sx={{ fontSize: isPhone ? "0.8rem" : "inherit" }}
      >
        {type.includes(1) ? "Overview" : "Cures"}
      </Link>
      {parentMedicineType && (
        <Typography
          color="text.primary"
          sx={{ fontSize: isPhone ? "0.8rem" : "inherit" }}
        >
          {parentMedicineType}
        </Typography>
      )}
      <Typography
        color="text.primary"
        sx={{ fontSize: isPhone ? "0.8rem" : "inherit" }}
      >
        {medicineTypeName}
      </Typography>
    </Breadcrumbs>
  );
};

export default CustomBreadcrumbs;
