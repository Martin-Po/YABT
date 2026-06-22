import { Box } from "@mui/material";

export const HomeStructure = ({ children }) => {
  return (
    <Box sx={{ width: "100vw" }}>
      <Box
        sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          width: "100%",          // 🔥 clave
          maxWidth: "1280px",
          marginLeft: "auto",
          marginRight: "auto",
          px: { xs: 2, sm: 3 },
          py: { xs: 3, sm: 4 },
          boxSizing: "border-box",
        }}
      >
        {children}
      </Box>
    </Box>
  );
};