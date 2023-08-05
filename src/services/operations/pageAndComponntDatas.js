import { toast } from "react-hot-toast"

import { apiConnector } from "../apiConnector"
import { catalogData } from "../apis"

export const getCatalogPageData = async (categoryId) => {
  const toastId = toast.loading("Loading...");
  let result = [];

  try {
    const response = await apiConnector(
      "POST",
      catalogData.CATALOGPAGEDATA_API,
      {
        categoryId: categoryId,
      }
    );

    if (!response?.data?.success) {
      throw new Error("Could Not Fetch Category page data.");
    }

    result = response?.data?.data; // Make sure 'data' property exists in the response
  } catch (error) {
    console.log("CATALOGPAGEDATA_API API ERROR............", error);
    toast.error(error.message);
    result = []; // Set an appropriate default value or handle the error case
  }

  toast.dismiss(toastId);
  return result;
};

