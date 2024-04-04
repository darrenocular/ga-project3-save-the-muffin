import React, { useState, useEffect, useContext, useRef } from "react";
import styles from "./styles/CreateListing.module.css";
import useFetch from "../hooks/useFetch";
import AppContext from "../context/AppContext";

const CreateListing = (props) => {
  const fetchData = useFetch();
  const appCtx = useContext(AppContext);
  const [categoriesList, setCategoriesList] = useState([]);

  const nameRef = useRef();
  const categoryRef = useRef();
  const quantityRef = useRef();
  const originalPriceRef = useRef();
  const discountedPriceRef = useRef();
  const descriptionRef = useRef();
  const imageRef = useRef();
  const dateRef = useRef();
  const timeRef = useRef();

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

  const handleClearForm = () => {
    try {
      nameRef.current.value = "";
      categoryRef.current.value = "";
      quantityRef.current.value = "";
      originalPriceRef.current.value = "";
      discountedPriceRef.current.value = "";
      descriptionRef.current.value = "";
      imageRef.current.value = "";
      dateRef.current.value = "";
      timeRef.current.value = "";
    } catch (error) {
      console.error(error.message);
      appCtx.setErrorMessage(error.message);
      app.setIsError(error.message);
    }
  };

  const handleSubmit = async (event) => {
    try {
      event.preventDefault();
      if (
        !appCtx.id ||
        !nameRef.current.value ||
        !originalPriceRef.current.value ||
        !discountedPriceRef.current.value ||
        !quantityRef.current.value ||
        !dateRef.current.value ||
        !timeRef.current.value ||
        !categoryRef.current.value
      ) {
        throw new Error("Mandatory fields have to be filled");
      }

      if (discountedPriceRef.current.value > originalPriceRef.current.value) {
        throw new Error(
          "Discounted Price has to be less than or same as original price."
        );
      }

      const apptDateTime = new Date(
        `${dateRef.current.value}T${timeRef.current.value}`
      );
      if (apptDateTime === "Invalid Date") {
        throw new Error("Invalid Date");
      }

      const newListing = {
        merchant: appCtx.id,
        name: nameRef.current.value,
        originalPrice: originalPriceRef.current.value,
        discountedPrice: discountedPriceRef.current.value,
        quantity: quantityRef.current.value,
        description: descriptionRef.current.value,
        category: categoryRef.current.value,
        image: imageRef.current.value,
        collectionDate: apptDateTime,
      };

      const res = await fetchData(
        "/api/listings",
        "PUT",
        newListing,
        appCtx.accessToken
      );

      if (res.ok) {
        nameRef.current.value = "";
        categoryRef.current.value = "";
        quantityRef.current.value = "";
        originalPriceRef.current.value = "";
        discountedPriceRef.current.value = "";
        descriptionRef.current.value = "";
        imageRef.current.value = "";
        dateRef.current.value = "";
        timeRef.current.value = "";

        props.createdListing(true);
      }
    } catch (error) {
      console.error(error.message);
      appCtx.setErrorMessage(error.message);
      appCtx.setIsError(true);
    }
  };

  return (
    <>
      <form className="overflow-y-auto p-3 grow">
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
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    placeholder="Attractive Meal Name"
                    ref={nameRef}
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
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    ref={categoryRef}
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
                    ref={quantityRef}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
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
                  <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                    <span className="flex select-none items-center pl-3 text-gray-500 px-3 sm:text-sm">
                      $
                    </span>
                    <input
                      type="number"
                      min="0"
                      name="originalPrice"
                      id="originalPrice"
                      ref={originalPriceRef}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
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
                      ref={discountedPriceRef}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
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
                  ref={dateRef}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
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
                  ref={timeRef}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
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
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    defaultValue={""}
                    placeholder="Write a few sentences about your listing."
                    ref={descriptionRef}
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
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    placeholder="http://www.hostingwebsite.com/uri"
                    ref={imageRef}
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
            Save
          </button>
        </div>
      </form>
    </>
  );
};

export default CreateListing;
