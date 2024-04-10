import React, { useState, useEffect, useContext, useRef } from "react";
import useFetch from "../hooks/useFetch";
import AppContext from "../context/AppContext";

const CreateListing = (props) => {
  const fetchData = useFetch();
  const appCtx = useContext(AppContext);
  const [categoriesList, setCategoriesList] = useState([]);

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [discountedPrice, setDiscountedPrice] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const getFoodCategories = async () => {
    try {
      const res = await fetchData("/api//listings/categories", "GET");

      if (res.ok) {
        setCategoriesList(res.data);
      }
    } catch (error) {
      appCtx.setErrorMessage(error.message);
      appCtx.setIsError(true);
    }
  };

  useEffect(() => {
    getFoodCategories();
  }, []);

  useEffect(() => {
    if (props.selectedListing?.name) {
      setName(props.selectedListing.name);
    } else {
      setName("");
    }
    if (props.selectedListing?.category) {
      setCategory(props.selectedListing.category);
    } else {
      setCategory("");
    }
    if (props.selectedListing?.quantity) {
      setQuantity(props.selectedListing.quantity);
    } else {
      setQuantity("");
    }
    if (props.selectedListing?.originalPrice) {
      setOriginalPrice(props.selectedListing.originalPrice);
    } else {
      setOriginalPrice("");
    }
    if (props.selectedListing?.discountedPrice) {
      setDiscountedPrice(props.selectedListing.discountedPrice);
    } else {
      setDiscountedPrice("");
    }
    if (props.selectedListing?.description) {
      setDescription(props.selectedListing.description);
    } else {
      setDescription("");
    }
    if (props.selectedListing?.image) {
      setImage(props.selectedListing.image);
    } else {
      setImage("");
    }

    if (props.selectedListing?.collectionDate) {
      const newDate = new Date(
        props.selectedListing.collectionDate
      ).toLocaleDateString("en-CA");
      const newTime = new Date(
        props.selectedListing.collectionDate
      ).toLocaleTimeString();
      setDate(newDate);
      setTime(newTime);
    } else {
      setDate("");
      setTime("");
    }
  }, [props.update, props.selectedListing]);

  const handleChange = (event) => {
    let number;
    switch (event.target.id) {
      case "name":
        setName(event.target.value);
        break;
      case "category":
        setCategory(event.target.value);
        break;
      case "quantity":
        setQuantity(event.target.value);
        break;
      case "originalPrice":
        number = parseFloat(event.target.value);
        if (isNaN(number)) {
          appCtx.setErrorMessage("originalPrice field has to be a number");
          appCtx.setIsError(true);
        } else {
          setOriginalPrice(number);
        }
        break;
      case "discountedPrice":
        number = parseFloat(event.target.value);
        if (isNaN(number)) {
          appCtx.setErrorMessage("discountedPrice field has to be a number");
          appCtx.setIsError(true);
        } else {
          setDiscountedPrice(number);
        }
        break;
      case "date":
        setDate(event.target.value);
        break;
      case "time":
        setTime(event.target.value);
        break;
      case "description":
        setDescription(event.target.value);
        break;
      case "image":
        setImage(event.target.value);
        break;
      default:
        console.log(
          `error, id ${event.target.id}, value: ${event.target.value}`
        );
        break;
    }
  };

  const handleClearForm = () => {
    try {
      setName("");
      setCategory("");
      setQuantity("");
      setOriginalPrice("");
      setDiscountedPrice("");
      setDescription("");
      setImage("");
      setDate("");
      setTime("");
      if (props.update) props.setUpdate(false);
    } catch (error) {
      console.error(error.message);
      appCtx.setErrorMessage(error.message);
      app.setIsError(error.message);
    }
  };

  const handleSubmit = async (event) => {
    try {
      event.preventDefault();
      const dateTime = new Date(`${date}T${time}`);
      console.log(dateTime);
      if (isNaN(dateTime)) {
        throw new Error("Invalid Date");
      }

      if (
        !appCtx.id ||
        !name ||
        !originalPrice ||
        !discountedPrice ||
        !quantity ||
        !date ||
        !time ||
        !category
      ) {
        throw new Error("Mandatory fields have to be filled");
      }

      if (discountedPrice > originalPrice) {
        throw new Error(
          "Discounted Price has to be less than or same as original price."
        );
      }

      const listing = {
        merchant: appCtx.id,
        name: name,
        originalPrice: originalPrice,
        discountedPrice: discountedPrice,
        quantity: quantity,
        description: description,
        category: category,
        image: image,
        collectionDate: dateTime,
      };

      if (props.update) {
        listing.id = props.selectedListing._id;
        console.log(listing);
        const res = await fetchData(
          "/api/listings",
          "PATCH",
          listing,
          appCtx.accessToken
        );

        if (res.ok) {
          setName("");
          setCategory("");
          setQuantity("");
          setOriginalPrice("");
          setDiscountedPrice("");
          setDescription("");
          setImage("");
          setDate("");
          setTime("");

          props.createdListing(true);
          props.setSelectedListing(null);
        } else {
          throw new Error(res.data);
        }
      } else {
        const res = await fetchData(
          "/api/listings",
          "PUT",
          listing,
          appCtx.accessToken
        );

        if (res.ok) {
          setName("");
          setCategory("");
          setQuantity("");
          setOriginalPrice("");
          setDiscountedPrice("");
          setDescription("");
          setImage("");
          setDate("");
          setTime("");

          props.createdListing(true);
          props.setSelectedListing(null);
        } else {
          throw new Error(res.data);
        }
      }
    } catch (error) {
      console.error(error);
      appCtx.setErrorMessage(error.message);
      appCtx.setIsError(true);
    }
  };

  return (
    <>
      <form className="overflow-y-auto p-3">
        <div className="space-y-12">
          <div className="border-b border-gray-900/10 pb-12">
            <h2 className="text-base font-semibold leading-7 text-gray-900">
              {props.update ? "Update Listing" : "Create Listing"}
            </h2>
            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="col-span-full">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Food name<span className="required">*</span>
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="name"
                    id="name"
                    className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    placeholder="Attractive Meal Name"
                    value={name}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="sm:col-span-3">
                <label
                  htmlFor="category"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Food category<span className="required">*</span>
                </label>
                <div className="mt-2">
                  <select
                    name="category"
                    id="category"
                    className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    value={category}
                    onChange={handleChange}
                  >
                    <option value="" disabled>
                      Select a category
                    </option>
                    {categoriesList &&
                      categoriesList.map((item) => {
                        return (
                          <option key={item} value={item}>
                            {item}
                          </option>
                        );
                      })}
                  </select>
                </div>
              </div>

              <div className="sm:col-span-3">
                <label
                  htmlFor="quantity"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Stock for sale<span className="required">*</span>
                </label>
                <div className="mt-2">
                  <input
                    id="quantity"
                    name="quantity"
                    type="number"
                    step="1"
                    min="1"
                    value={quantity}
                    onChange={handleChange}
                    className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label
                  htmlFor="originalPrice"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Original Price<span className="required">*</span>
                </label>
                <div className="mt-2">
                  <div className="flex w-full rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                    <span className="flex select-none items-center pl-3 text-gray-500 px-3 sm:text-sm">
                      $
                    </span>
                    <input
                      type="number"
                      min="0"
                      name="originalPrice"
                      id="originalPrice"
                      value={originalPrice}
                      onChange={handleChange}
                      className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
              </div>

              <div className="sm:col-span-3">
                <label
                  htmlFor="discountedPrice"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Discounted Price<span className="required">*</span>
                </label>
                <div className="mt-2">
                  <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                    <span className="flex select-none items-center pl-3 text-gray-500 px-3 sm:text-sm">
                      $
                    </span>
                    <input
                      type="number"
                      min="0"
                      name="discountedPrice"
                      id="discountedPrice"
                      value={discountedPrice}
                      onChange={handleChange}
                      className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
              </div>

              <div className="sm:col-span-3">
                <label
                  htmlFor="date"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Collection Date<span className="required">*</span>
                </label>
                <input
                  type="date"
                  id="date"
                  value={date}
                  onChange={handleChange}
                  className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
              <div className="sm:col-span-3">
                <label
                  htmlFor="time"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Collection Time<span className="required">*</span>
                </label>
                <input
                  type="time"
                  id="time"
                  value={time}
                  onChange={handleChange}
                  className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>

              <div className="col-span-full">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Description
                </label>
                <div className="mt-2">
                  <textarea
                    id="description"
                    name="description"
                    rows={3}
                    className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    value={description}
                    onChange={handleChange}
                    placeholder="Write a few sentences about your listing."
                  />
                </div>
              </div>

              <div className="col-span-full">
                <label
                  htmlFor="image"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Image URL
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="image"
                    id="image"
                    className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    placeholder="http://www.hostingwebsite.com/uri"
                    value={image}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-x-6">
          <button
            type="button"
            className="text-sm font-semibold leading-6 text-gray-900"
            onClick={handleClearForm}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            onClick={handleSubmit}
          >
            {props.update ? "Update" : "Save"}
          </button>
        </div>
      </form>
    </>
  );
};

export default CreateListing;
