"use client";

"use client";

import { FC, useEffect, useState } from "react";
import Box from "@component/Box";
import Grid from "@component/grid/Grid";
import { Card1 } from "@component/Card1";
import Select from "@component/Select";
import FlexBox from "@component/FlexBox";
import TextField from "@component/text-field";
import Typography, { Paragraph } from "@component/Typography";
import checkoutApi from "@utils/__api__/checkout";

export default function CheckoutForm({ formik }: { formik: any }) {
  const { values, errors, touched, handleChange, handleBlur, setFieldValue } = formik;
  const [districts, setDistricts] = useState<any[]>([]);
  const [allThanas, setAllThanas] = useState<any[]>([]);
  const [thanas, setThanas] = useState<any[]>([]);

  useEffect(() => {
    const fetchLocations = async () => {
      const data = await checkoutApi.getDistrictsAndThanas();
      if (data && Array.isArray(data.district)) {
        const formattedDistricts = data.district
          .map((d: any) => ({
            label: d.district,
            value: d.id
          }))
          .sort((a: any, b: any) => a.label.localeCompare(b.label));
        setDistricts(formattedDistricts);
        setAllThanas(data.thana || []);
      }
    };
    fetchLocations();
  }, []);

  useEffect(() => {
    if (values.district && allThanas.length > 0) {
      const filteredThanas = allThanas
        .filter((t: any) => t.district_thana_id === values.district)
        .map((t: any) => ({ label: t.thana, value: t.id }))
        .sort((a: any, b: any) => a.label.localeCompare(b.label));
      setThanas(filteredThanas);

      // Fetch shipping cost
      const fetchShipping = async () => {
        const costData = await checkoutApi.getShippingCost(values.district);
        if (costData && costData.success && costData.data && costData.data.price) {
          setFieldValue("shipping_cost", Number(costData.data.price));
        }
      };
      fetchShipping();
    } else {
      setThanas([]);
    }
  }, [values.district, allThanas, setFieldValue]);

  return (
    <Card1 mb="2rem">
      <Typography fontWeight="700" mb="0.5rem" fontSize="20px">
        Billing Info
      </Typography>
      <Paragraph color="text.muted" mb="1.5rem">
        Add your billing information
      </Paragraph>

      <Box mb="1.5rem">
        <Typography fontWeight="600" mb="0.5rem" fontSize="14px">
          Phone
        </Typography>
        <TextField
          fullwidth
          name="phone"
          onBlur={handleBlur}
          onChange={handleChange}
          value={values.phone}
          errorText={touched.phone && errors.phone}
          placeholder="+8801"
        />
      </Box>

      <Box mb="1.5rem">
        <Typography fontWeight="600" mb="0.5rem" fontSize="14px">
          Name *
        </Typography>
        <TextField
          fullwidth
          name="full_name"
          onBlur={handleBlur}
          onChange={handleChange}
          value={values.full_name}
          errorText={touched.full_name && errors.full_name}
          placeholder="Enter Your Name"
        />
      </Box>

      <Grid container spacing={3} mb="1.5rem">
        <Grid item sm={6} xs={12}>
          <Typography fontWeight="600" mb="0.5rem" fontSize="14px">
            District
          </Typography>
          <Select
            isSearchable={true}
            isClearable={true}
            options={districts}
            value={districts.find((d) => d.value === values.district) || ""}
            errorText={touched.district && errors.district}
            onChange={(district: any) => {
              setFieldValue("district", district ? district.value : "");
              setFieldValue("thana", ""); // Reset thana when district changes
            }}
            placeholder="Select District"
          />
        </Grid>

        <Grid item sm={6} xs={12}>
          <Typography fontWeight="600" mb="0.5rem" fontSize="14px">
            Thana
          </Typography>
          <Select
            isSearchable={true}
            isClearable={true}
            options={thanas}
            value={thanas.find((d) => d.value === values.thana) || ""}
            errorText={touched.thana && errors.thana}
            onChange={(thana: any) => setFieldValue("thana", thana ? thana.value : "")}
            placeholder="Select Thana"
            isDisabled={thanas.length === 0}
          />
        </Grid>
      </Grid>

      <Box mb="1.5rem">
        <Typography fontWeight="600" mb="0.5rem" fontSize="14px">
          Address
        </Typography>
        <TextField
          fullwidth
          multiline
          rows={4}
          name="address"
          onBlur={handleBlur}
          onChange={handleChange}
          value={values.address}
          errorText={touched.address && errors.address}
          placeholder="Enter your full address here"
        />
      </Box>

      <Box mb="0.5rem">
        <Typography fontWeight="600" mb="0.5rem" fontSize="14px">
          Special Note
        </Typography>
        <TextField
          fullwidth
          multiline
          rows={4}
          name="special_note"
          onBlur={handleBlur}
          onChange={handleChange}
          value={values.special_note}
          errorText={touched.special_note && errors.special_note}
          placeholder="Enter your full address here"
          style={{ marginBottom: "5px" }}
        />
        <FlexBox justifyContent="space-between" alignItems="center">
          <Typography fontSize="12px" color="text.hint">
            Max 250 character
          </Typography>
          <Typography fontSize="12px" color="text.hint">
            {values.special_note?.length || 0}/250
          </Typography>
        </FlexBox>
      </Box>
    </Card1>
  );
}
