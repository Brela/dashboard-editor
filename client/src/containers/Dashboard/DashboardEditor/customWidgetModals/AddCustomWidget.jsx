import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Modal, InfoCard, Button } from "../../../../components";
import ButtonGroupField from "../../../../components/formFields/ButtonGroupField";
import SelectField from "../../../../components/formFields/SelectField";
import InputField from "../../../../components/formFields/InputField";
import ColorPicker from "./ColorPicker";

import { iconOptions } from "../../helpers/iconMap";
import { createCustomWidget } from "../../../../services/dashboardAPIcalls";

const AddCustomWidgetModal = ({ open, closeModal, fetchCustomWidgets }) => {
  const [dataLoading, setDataLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({
    type: "",
    title: "",
    message: "",
  });

  const [color, setColor] = useState("#D4DEDA");

  const dummyValue = {
    count_or_total: "count",
  };

  const {
    handleSubmit,
    control,
    reset,
    watch,
    formState: { isDirty },
  } = useForm();

  useEffect(() => {
    setDataLoading(true);
    try {
      reset(dummyValue);
    } catch (error) {
      setError(error);
    } finally {
      setDataLoading(false);
    }
  }, [reset]);

  const clearError = () => {
    setError({ type: "", message: "", title: "" });
  };

  const onSubmit = async (data) => {
    setLoading(true);
    clearError();

    try {
      const processedData = {
        name: data.name,
        entity: data.dataToAccess,
        criteria: data.viewToAccess,
        displayType: "count",
        icon: data.icon,
        color: color,
      };
      console.log(processedData);
      const createdCustomWidget = await createCustomWidget(processedData);
      console.log(createdCustomWidget);

      fetchCustomWidgets();
      closeModal(); // Close the modal on successful creation
    } catch (err) {
      setError({
        type: "error",
        title: "Error",
        message: err.message || "Failed to create custom widget",
      });
      setTimeout(() => {
        clearError();
      }, 5000);
    } finally {
      setLoading(false);
    }
  };

  const onClose = () => {
    closeModal();
    reset();
  };

  return (
    <Modal
      title={"Add Custom Widget"}
      open={open}
      setOpen={closeModal}
      modalStyle={`md:max-w-md overflow-y-auto`}
      placement="top"
      ui={
        <div>
          {dataLoading ? (
            <div className="flex justify-center my-5 items-center h-full">
              Loading...
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="px-1 mt-12">
              <Controller
                control={control}
                name="name"
                rules={{
                  required: "Required",
                }}
                render={(props) => (
                  <InputField
                    {...props}
                    className="mb-4"
                    label="Name"
                    placeholder=""
                    required
                  />
                )}
              />
              <Controller
                control={control}
                name="dataToAccess"
                rules={{
                  required: "Required",
                }}
                render={(props) => (
                  <SelectField
                    {...props}
                    options={[
                      {
                        label: "Inventory",
                        value: "inventory",
                      },
                    ]}
                    label="Data to Access"
                    isClearable
                    required
                  />
                )}
              />
              <Controller
                control={control}
                name="viewToAccess"
                /*  rules={{
                  required: "Required",
                }} */
                render={(props) => (
                  <SelectField
                    {...props}
                    options={[
                      {
                        label: "Paid Invoices",
                        value: "paidInvoices",
                      },
                    ]}
                    label="View to Access"
                    isClearable
                    // required
                  />
                )}
              />
              <Controller
                control={control}
                name="displayType"
                /*   rules={{
              required: "Required",
            }} */
                render={(props) => (
                  <div className="w-[50%]">
                    <ButtonGroupField
                      // buttonsClassNames={["basis-1/3", "basis-2/3"]}
                      buttonsClassName={"py-1.5"}
                      options={[
                        {
                          name: "Count",
                          value: "count",
                        },
                        {
                          name: "Total",
                          value: "total",
                        },
                      ]}
                      {...props}
                      label="Display Type"
                      //   required
                      className=""
                    />
                  </div>
                )}
              />

              {watch("displayType") === "total" ? (
                <Controller
                  control={control}
                  name="columnToTotal"
                  /*  rules={{
                  required: "Required",
                }} */
                  render={(props) => (
                    <SelectField
                      {...props}
                      options={[
                        {
                          label: "Invoice Total",
                          value: "invoice_total",
                        },
                        {
                          label: "Pay Reports Total",
                          value: "pay_reports_total",
                        },
                      ]}
                      label="Column to Total"
                      isClearable
                      // required
                    />
                  )}
                />
              ) : (
                <div></div>
              )}
              <Controller
                control={control}
                name="icon"
                rules={{
                  required: "Required",
                }}
                render={(props) => (
                  <SelectField
                    {...props}
                    options={iconOptions}
                    label="Icon"
                    isClearable
                    required
                  />
                )}
              />
              <div>
                <h4 className="my-2 mt-3 block text-sm font-medium text-gray-800">
                  Color
                </h4>
                <ColorPicker color={color} setColor={setColor} />
              </div>

              {error.message !== "" && (
                <InfoCard
                  type={error.type}
                  message={error.message}
                  title={error.title}
                  forever={true}
                />
              )}

              <div className="flex justify-end mt-10 gap-x-2 ">
                <>
                  <Button variant="ghost" onClick={onClose}>
                    Cancel
                  </Button>

                  <Button
                    isLoading={loading}
                    loadingText="Saving..."
                    type="submit"
                  >
                    Save
                  </Button>
                </>
              </div>
            </form>
          )}
        </div>
      }
    />
  );
};

export default AddCustomWidgetModal;
