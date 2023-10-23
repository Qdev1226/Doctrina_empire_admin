// React Hook & Redux  
import { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import Card from "@mui/material/Card";
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import { Grid, Radio, RadioGroup } from '@mui/material';
import MDInput from 'components/MDInput';
import MDTypography from 'components/MDTypography';
import CheckIcon from '@mui/icons-material/Check';
import MDButton from 'components/MDButton';
import SaveIcon from '@mui/icons-material/Save';

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import CustomSnackbar from "components/MDSnackbar/customSnackbar"
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';

import DefaultTokenSetting from './defaultTokenSetting';
import { fetchFreeTokenCount } from '../../actions/freeTokenAction'
import { fetchMemberships, updateMemberships } from '../../actions/membershipAction'
import { clearAction } from '../../actions/engineAction'
import { rgb } from "chroma-js";

function MembershipCard(props) {

  let membership = props.membership
  let showMonthly = props.showMonthly
  let index = props.index

  const pricingSpecs = [
    'AI Article Writer',
    'Premium Support',
    'Social Media Integration',
    'Content Analytics',
    '100+ AI Templates',
    'Team Collaboration',
    'SEO Optimisation',
    'Customisable Templates'
  ]

  const [tokens, setTokens] = useState(0)
  const [monthlyPrice, setMonthlyPrice] = useState(0)
  const [annualPrice, setAnnualPrice] = useState(0)

  useEffect(() => {
    setMonthlyPrice(membership.monthly_price.$numberDecimal);
    setAnnualPrice(membership.annual_price.$numberDecimal);
    setTokens(membership.tokens)
  }, [membership])

  useEffect(() => {
    props.changeMonthPrice(index, monthlyPrice)
  }, [monthlyPrice])

  useEffect(() => {
    props.changeYearPrice(index, annualPrice)
  }, [annualPrice])

  useEffect(() => {
    props.changeToken(index, tokens)
  }, [tokens])

  return (
    <MDBox padding="1rem">
      <Grid container spacing={1}>
        <Grid item lg={6}>
          <MDInput
            type="number"
            label={`${membership.title} price`}
            value={showMonthly == 0 ? monthlyPrice : annualPrice}
            size="small"
            style={{ textAlign: 'right' }}
            onChange={(e) => showMonthly == 0 ? setMonthlyPrice(e.target.value) : setAnnualPrice(e.target.value)}
            fullWidth />
        </Grid>
        <Grid item lg={6}>
          <MDInput
            type="number"
            label={`${membership.title} tokens`}
            value={tokens}
            size="small"
            onChange={(e) => setTokens(e.target.value)}
            fullWidth />
        </Grid>
      </Grid>

      <MDBox
        variant="gradient"
        bgColor={'dark'}
        color={'white'}
        borderRadius="lg"
        coloredShadow={'dark'}
        py={3}
        px={1}
        mt={2}
      >
        <MDBox
          variant="gradient"
          bgColor="info"
          color="white"
          coloredShadow="info"
          borderRadius="xl"
          display="flex"
          justifyContent="center"
          alignItems="center"
          style={{ width: '50%', marginRight: 'auto', marginLeft: 'auto' }}
        >
          {membership.title}
        </MDBox>
        {
          pricingSpecs.length > 0 &&
          <>
            <MDBox style={{ padding: '16px 8px 0px 8px', textAlign: 'center' }}>
              <MDTypography variant="h2" gutterBottom color="white">
                {showMonthly == 0 ? `$${membership.monthly_price.$numberDecimal}/mo` : `$${membership.annual_price.$numberDecimal}/year`}
              </MDTypography>
            </MDBox>
            <MDBox style={{ padding: '0px 32px' }}>
              <MDBox display="flex" alignItems="center" style={{ color: 'white', margin: '16px' }}>
                <CheckIcon />
                <MDTypography variant="button" fontWeight="regular" color="white" style={{ marginLeft: '12px' }}>
                  &nbsp;{Number(membership.tokens).toLocaleString('en-US')} tokens per month
                </MDTypography>
              </MDBox>
              {
                pricingSpecs.map((item, index) => (
                  <MDBox key={index} display="flex" alignItems="center" style={{ color: 'white', margin: '16px' }}>
                    <CheckIcon />
                    <MDTypography variant="button" fontWeight="regular" color="white" style={{ marginLeft: '12px' }}>
                      &nbsp;{item}
                    </MDTypography>
                  </MDBox>
                ))
              }
            </MDBox>
          </>
        }
      </MDBox>
    </MDBox>
  )
}

function Memberships() {
  const snapbarRef = useRef();
  const { memberships } = useSelector(state => state.memberships)
  const { actionType } = useSelector(state => state.memberships)
  const { refresh } = useSelector(state => state.memberships)
  let submitMembershipsData = []

  memberships && memberships.map(item => {
    let membership = {
      membership: item.membership,
      monthly_price: item.monthly_price.$numberDecimal,
      annual_price: item.annual_price.$numberDecimal,
      tokens: item.tokens
    }
    submitMembershipsData.push(membership)
  })

  const dispatch = useDispatch()
  const [showMonthly, setShowMonthly] = useState(0)

  if (!localStorage.getItem('token'))
    window.location.href = '/'

  useEffect(() => {
    dispatch(fetchFreeTokenCount())
    dispatch(fetchMemberships())
  }, [])

  useEffect(() => {
    let message = ''
    if (actionType === '') return;
    if (actionType === 'update') {
      message = 'Successfully updated.'
    }

    snapbarRef.current.showSnackbar({
      show: true,
      type: 'success',
      message: message
    });

    dispatch(clearAction())
    dispatch(fetchMemberships())
  }, [refresh])

  const submitMembership = () => {
    dispatch(updateMemberships(submitMembershipsData))
  }

  const handleShowMonth = (e) => {
    e.target.value === '0' ? setShowMonthly(0) : setShowMonthly(1)
  }

  const changeMonthPrice = (index, monthlyPrice) => {
    submitMembershipsData[index].monthly_price = monthlyPrice
  }

  const changeYearPrice = (index, annualPrice) => {
    submitMembershipsData[index].annual_price = annualPrice
  }

  const changeToken = (index, tokens) => {
    submitMembershipsData[index].tokens = tokens
  }

  return (
    < DashboardLayout >
      <DashboardNavbar />
      <MDBox pt={1} pb={3}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <MDBox mb={2}>
              <DefaultTokenSetting />
            </MDBox>
          </Grid>
          <Grid item xs={12}>
            <Card>
              <MDBox display="flex" pt={1} px={2}>
                <Grid container>
                  <Grid item lg={10} style={{ display: 'flex' }}>
                    <MDBox
                      variant="gradient"
                      bgColor="info"
                      color="white"
                      coloredShadow="info"
                      borderRadius="xl"
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                      width="4rem"
                      height="4rem"
                      mt={-2.5}
                      mr={2}
                    >
                      <ShoppingCartCheckoutIcon fontSize="medium" color="inherit" />
                    </MDBox>
                    <MDBox>
                      <h4 style={{ color: rgb(52, 71, 103) }}>Manage memberships</h4>
                      <span style={{ fontSize: 14, color: rgb(123, 128, 154) }}>Edit price and tokens per month</span>
                    </MDBox>
                  </Grid>
                  <Grid item lg={2} style={{ textAlign: 'right' }}>
                    <MDBox lineHeight={1.25}>
                      <MDButton variant="contained" color="success" size="small" onClick={submitMembership} >
                        <SaveIcon>add</SaveIcon>
                        &nbsp;SAVE
                      </MDButton>
                    </MDBox>
                  </Grid>
                  <FormControl ml={5} style={{ marginBottom: '8px', marginLeft: '24px', marginTop: '16px' }}>
                    <RadioGroup
                      row
                      aria-labelledby="demo-row-radio-buttons-group-label"
                      name="row-radio-buttons-group"
                      value={showMonthly}
                      onChange={handleShowMonth}
                    >
                      <FormControlLabel value="0" style={{ marginRight: 24 }} control={<Radio />} label="Monthly" />
                      <FormControlLabel value="1" style={{ marginRight: 24 }} control={<Radio />} label="Annual" />
                    </RadioGroup>
                  </FormControl>
                  <Grid container spacing={2}>
                    {
                      memberships && memberships.map((membership, index) => (
                        <Grid item lg={4} key={index}>
                          <MembershipCard
                            membership={membership}
                            index={index}
                            showMonthly={showMonthly}
                            changeMonthPrice={(index, monthPrice) => changeMonthPrice(index, monthPrice)}
                            changeYearPrice={(index, yearPrice) => changeYearPrice(index, yearPrice)}
                            changeToken={(index, tokens) => changeToken(index, tokens)}
                          />
                        </Grid>
                      ))
                    }
                  </Grid>
                </Grid>
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <CustomSnackbar ref={snapbarRef} />
    </DashboardLayout >
  );
}

export default Memberships;
