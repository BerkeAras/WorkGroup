import React, { useRef } from 'react'
import './style.scss'
import { Modal, Header, Button, Form, TextArea, Input, Dropdown } from 'semantic-ui-react'
import PropTypes from 'prop-types'
import axios, { put } from 'axios'

import unknownBanner from '../../static/banner.jpg'
import unknownAvatar from '../../static/unknown.png'

const countryOptions = [
    { text: 'Afghanistan', key: 'AF', value: 'AF' },
    { text: 'Åland Islands', key: 'AX', value: 'AX' },
    { text: 'Albania', key: 'AL', value: 'AL' },
    { text: 'Algeria', key: 'DZ', value: 'DZ' },
    { text: 'American Samoa', key: 'AS', value: 'AS' },
    { text: 'Andorra', key: 'AD', value: 'AD' },
    { text: 'Angola', key: 'AO', value: 'AO' },
    { text: 'Anguilla', key: 'AI', value: 'AI' },
    { text: 'Antarctica', key: 'AQ', value: 'AQ' },
    { text: 'Antigua and Barbuda', key: 'AG', value: 'AG' },
    { text: 'Argentina', key: 'AR', value: 'AR' },
    { text: 'Armenia', key: 'AM', value: 'AM' },
    { text: 'Aruba', key: 'AW', value: 'AW' },
    { text: 'Australia', key: 'AU', value: 'AU' },
    { text: 'Austria', key: 'AT', value: 'AT' },
    { text: 'Azerbaijan', key: 'AZ', value: 'AZ' },
    { text: 'Bahamas (the)', key: 'BS', value: 'BS' },
    { text: 'Bahrain', key: 'BH', value: 'BH' },
    { text: 'Bangladesh', key: 'BD', value: 'BD' },
    { text: 'Barbados', key: 'BB', value: 'BB' },
    { text: 'Belarus', key: 'BY', value: 'BY' },
    { text: 'Belgium', key: 'BE', value: 'BE' },
    { text: 'Belize', key: 'BZ', value: 'BZ' },
    { text: 'Benin', key: 'BJ', value: 'BJ' },
    { text: 'Bermuda', key: 'BM', value: 'BM' },
    { text: 'Bhutan', key: 'BT', value: 'BT' },
    { text: 'Bolivia (Plurinational State of)', key: 'BO', value: 'BO' },
    { text: 'Bonaire, Sint Eustatius and Saba', key: 'BQ', value: 'BQ' },
    { text: 'Bosnia and Herzegovina', key: 'BA', value: 'BA' },
    { text: 'Botswana', key: 'BW', value: 'BW' },
    { text: 'Bouvet Island', key: 'BV', value: 'BV' },
    { text: 'Brazil', key: 'BR', value: 'BR' },
    { text: 'British Indian Ocean Territory (the)', key: 'IO', value: 'IO' },
    { text: 'Brunei Darussalam', key: 'BN', value: 'BN' },
    { text: 'Bulgaria', key: 'BG', value: 'BG' },
    { text: 'Burkina Faso', key: 'BF', value: 'BF' },
    { text: 'Burundi', key: 'BI', value: 'BI' },
    { text: 'Cabo Verde', key: 'CV', value: 'CV' },
    { text: 'Cambodia', key: 'KH', value: 'KH' },
    { text: 'Cameroon', key: 'CM', value: 'CM' },
    { text: 'Canada', key: 'CA', value: 'CA' },
    { text: 'Cayman Islands (the)', key: 'KY', value: 'KY' },
    { text: 'Central African Republic (the)', key: 'CF', value: 'CF' },
    { text: 'Chad', key: 'TD', value: 'TD' },
    { text: 'Chile', key: 'CL', value: 'CL' },
    { text: 'China', key: 'CN', value: 'CN' },
    { text: 'Christmas Island', key: 'CX', value: 'CX' },
    { text: 'Cocos (Keeling) Islands (the)', key: 'CC', value: 'CC' },
    { text: 'Colombia', key: 'CO', value: 'CO' },
    { text: 'Comoros (the)', key: 'KM', value: 'KM' },
    { text: 'Congo (the Democratic Republic of the)', key: 'CD', value: 'CD' },
    { text: 'Congo (the)', key: 'CG', value: 'CG' },
    { text: 'Cook Islands (the)', key: 'CK', value: 'CK' },
    { text: 'Costa Rica', key: 'CR', value: 'CR' },
    { text: 'Croatia', key: 'HR', value: 'HR' },
    { text: 'Cuba', key: 'CU', value: 'CU' },
    { text: 'Curaçao', key: 'CW', value: 'CW' },
    { text: 'Cyprus', key: 'CY', value: 'CY' },
    { text: 'Czechia', key: 'CZ', value: 'CZ' },
    { text: "Côte d'Ivoire", key: 'CI', value: 'CI' },
    { text: 'Denmark', key: 'DK', value: 'DK' },
    { text: 'Djibouti', key: 'DJ', value: 'DJ' },
    { text: 'Dominica', key: 'DM', value: 'DM' },
    { text: 'Dominican Republic (the)', key: 'DO', value: 'DO' },
    { text: 'Ecuador', key: 'EC', value: 'EC' },
    { text: 'Egypt', key: 'EG', value: 'EG' },
    { text: 'El Salvador', key: 'SV', value: 'SV' },
    { text: 'Equatorial Guinea', key: 'GQ', value: 'GQ' },
    { text: 'Eritrea', key: 'ER', value: 'ER' },
    { text: 'Estonia', key: 'EE', value: 'EE' },
    { text: 'Eswatini', key: 'SZ', value: 'SZ' },
    { text: 'Ethiopia', key: 'ET', value: 'ET' },
    { text: 'Falkland Islands (the) [Malvinas]', key: 'FK', value: 'FK' },
    { text: 'Faroe Islands (the)', key: 'FO', value: 'FO' },
    { text: 'Fiji', key: 'FJ', value: 'FJ' },
    { text: 'Finland', key: 'FI', value: 'FI' },
    { text: 'France', key: 'FR', value: 'FR' },
    { text: 'French Guiana', key: 'GF', value: 'GF' },
    { text: 'French Polynesia', key: 'PF', value: 'PF' },
    { text: 'French Southern Territories (the)', key: 'TF', value: 'TF' },
    { text: 'Gabon', key: 'GA', value: 'GA' },
    { text: 'Gambia (the)', key: 'GM', value: 'GM' },
    { text: 'Georgia', key: 'GE', value: 'GE' },
    { text: 'Germany', key: 'DE', value: 'DE' },
    { text: 'Ghana', key: 'GH', value: 'GH' },
    { text: 'Gibraltar', key: 'GI', value: 'GI' },
    { text: 'Greece', key: 'GR', value: 'GR' },
    { text: 'Greenland', key: 'GL', value: 'GL' },
    { text: 'Grenada', key: 'GD', value: 'GD' },
    { text: 'Guadeloupe', key: 'GP', value: 'GP' },
    { text: 'Guam', key: 'GU', value: 'GU' },
    { text: 'Guatemala', key: 'GT', value: 'GT' },
    { text: 'Guernsey', key: 'GG', value: 'GG' },
    { text: 'Guinea', key: 'GN', value: 'GN' },
    { text: 'Guinea-Bissau', key: 'GW', value: 'GW' },
    { text: 'Guyana', key: 'GY', value: 'GY' },
    { text: 'Haiti', key: 'HT', value: 'HT' },
    { text: 'Heard Island and McDonald Islands', key: 'HM', value: 'HM' },
    { text: 'Holy See (the)', key: 'VA', value: 'VA' },
    { text: 'Honduras', key: 'HN', value: 'HN' },
    { text: 'Hong Kong', key: 'HK', value: 'HK' },
    { text: 'Hungary', key: 'HU', value: 'HU' },
    { text: 'Iceland', key: 'IS', value: 'IS' },
    { text: 'India', key: 'IN', value: 'IN' },
    { text: 'Indonesia', key: 'ID', value: 'ID' },
    { text: 'Iran (Islamic Republic of)', key: 'IR', value: 'IR' },
    { text: 'Iraq', key: 'IQ', value: 'IQ' },
    { text: 'Ireland', key: 'IE', value: 'IE' },
    { text: 'Isle of Man', key: 'IM', value: 'IM' },
    { text: 'Israel', key: 'IL', value: 'IL' },
    { text: 'Italy', key: 'IT', value: 'IT' },
    { text: 'Jamaica', key: 'JM', value: 'JM' },
    { text: 'Japan', key: 'JP', value: 'JP' },
    { text: 'Jersey', key: 'JE', value: 'JE' },
    { text: 'Jordan', key: 'JO', value: 'JO' },
    { text: 'Kazakhstan', key: 'KZ', value: 'KZ' },
    { text: 'Kenya', key: 'KE', value: 'KE' },
    { text: 'Kiribati', key: 'KI', value: 'KI' },
    { text: "Korea (the Democratic People's Republic of)", key: 'KP', value: 'KP' },
    { text: 'Korea (the Republic of)', key: 'KR', value: 'KR' },
    { text: 'Kuwait', key: 'KW', value: 'KW' },
    { text: 'Kyrgyzstan', key: 'KG', value: 'KG' },
    { text: "Lao People's Democratic Republic (the)", key: 'LA', value: 'LA' },
    { text: 'Latvia', key: 'LV', value: 'LV' },
    { text: 'Lebanon', key: 'LB', value: 'LB' },
    { text: 'Lesotho', key: 'LS', value: 'LS' },
    { text: 'Liberia', key: 'LR', value: 'LR' },
    { text: 'Libya', key: 'LY', value: 'LY' },
    { text: 'Liechtenstein', key: 'LI', value: 'LI' },
    { text: 'Lithuania', key: 'LT', value: 'LT' },
    { text: 'Luxembourg', key: 'LU', value: 'LU' },
    { text: 'Macao', key: 'MO', value: 'MO' },
    { text: 'Madagascar', key: 'MG', value: 'MG' },
    { text: 'Malawi', key: 'MW', value: 'MW' },
    { text: 'Malaysia', key: 'MY', value: 'MY' },
    { text: 'Maldives', key: 'MV', value: 'MV' },
    { text: 'Mali', key: 'ML', value: 'ML' },
    { text: 'Malta', key: 'MT', value: 'MT' },
    { text: 'Marshall Islands (the)', key: 'MH', value: 'MH' },
    { text: 'Martinique', key: 'MQ', value: 'MQ' },
    { text: 'Mauritania', key: 'MR', value: 'MR' },
    { text: 'Mauritius', key: 'MU', value: 'MU' },
    { text: 'Mayotte', key: 'YT', value: 'YT' },
    { text: 'Mexico', key: 'MX', value: 'MX' },
    { text: 'Micronesia (Federated States of)', key: 'FM', value: 'FM' },
    { text: 'Moldova (the Republic of)', key: 'MD', value: 'MD' },
    { text: 'Monaco', key: 'MC', value: 'MC' },
    { text: 'Mongolia', key: 'MN', value: 'MN' },
    { text: 'Montenegro', key: 'ME', value: 'ME' },
    { text: 'Montserrat', key: 'MS', value: 'MS' },
    { text: 'Morocco', key: 'MA', value: 'MA' },
    { text: 'Mozambique', key: 'MZ', value: 'MZ' },
    { text: 'Myanmar', key: 'MM', value: 'MM' },
    { text: 'Namibia', key: 'NA', value: 'NA' },
    { text: 'Nauru', key: 'NR', value: 'NR' },
    { text: 'Nepal', key: 'NP', value: 'NP' },
    { text: 'Netherlands (the)', key: 'NL', value: 'NL' },
    { text: 'New Caledonia', key: 'NC', value: 'NC' },
    { text: 'New Zealand', key: 'NZ', value: 'NZ' },
    { text: 'Nicaragua', key: 'NI', value: 'NI' },
    { text: 'Niger (the)', key: 'NE', value: 'NE' },
    { text: 'Nigeria', key: 'NG', value: 'NG' },
    { text: 'Niue', key: 'NU', value: 'NU' },
    { text: 'Norfolk Island', key: 'NF', value: 'NF' },
    { text: 'Northern Mariana Islands (the)', key: 'MP', value: 'MP' },
    { text: 'Norway', key: 'NO', value: 'NO' },
    { text: 'Oman', key: 'OM', value: 'OM' },
    { text: 'Pakistan', key: 'PK', value: 'PK' },
    { text: 'Palau', key: 'PW', value: 'PW' },
    { text: 'Palestine, State of', key: 'PS', value: 'PS' },
    { text: 'Panama', key: 'PA', value: 'PA' },
    { text: 'Papua New Guinea', key: 'PG', value: 'PG' },
    { text: 'Paraguay', key: 'PY', value: 'PY' },
    { text: 'Peru', key: 'PE', value: 'PE' },
    { text: 'Philippines (the)', key: 'PH', value: 'PH' },
    { text: 'Pitcairn', key: 'PN', value: 'PN' },
    { text: 'Poland', key: 'PL', value: 'PL' },
    { text: 'Portugal', key: 'PT', value: 'PT' },
    { text: 'Puerto Rico', key: 'PR', value: 'PR' },
    { text: 'Qatar', key: 'QA', value: 'QA' },
    { text: 'Republic of North Macedonia', key: 'MK', value: 'MK' },
    { text: 'Romania', key: 'RO', value: 'RO' },
    { text: 'Russian Federation (the)', key: 'RU', value: 'RU' },
    { text: 'Rwanda', key: 'RW', value: 'RW' },
    { text: 'Réunion', key: 'RE', value: 'RE' },
    { text: 'Saint Barthélemy', key: 'BL', value: 'BL' },
    { text: 'Saint Helena, Ascension and Tristan da Cunha', key: 'SH', value: 'SH' },
    { text: 'Saint Kitts and Nevis', key: 'KN', value: 'KN' },
    { text: 'Saint Lucia', key: 'LC', value: 'LC' },
    { text: 'Saint Martin (French part)', key: 'MF', value: 'MF' },
    { text: 'Saint Pierre and Miquelon', key: 'PM', value: 'PM' },
    { text: 'Saint Vincent and the Grenadines', key: 'VC', value: 'VC' },
    { text: 'Samoa', key: 'WS', value: 'WS' },
    { text: 'San Marino', key: 'SM', value: 'SM' },
    { text: 'Sao Tome and Principe', key: 'ST', value: 'ST' },
    { text: 'Saudi Arabia', key: 'SA', value: 'SA' },
    { text: 'Senegal', key: 'SN', value: 'SN' },
    { text: 'Serbia', key: 'RS', value: 'RS' },
    { text: 'Seychelles', key: 'SC', value: 'SC' },
    { text: 'Sierra Leone', key: 'SL', value: 'SL' },
    { text: 'Singapore', key: 'SG', value: 'SG' },
    { text: 'Sint Maarten (Dutch part)', key: 'SX', value: 'SX' },
    { text: 'Slovakia', key: 'SK', value: 'SK' },
    { text: 'Slovenia', key: 'SI', value: 'SI' },
    { text: 'Solomon Islands', key: 'SB', value: 'SB' },
    { text: 'Somalia', key: 'SO', value: 'SO' },
    { text: 'South Africa', key: 'ZA', value: 'ZA' },
    { text: 'South Georgia and the South Sandwich Islands', key: 'GS', value: 'GS' },
    { text: 'South Sudan', key: 'SS', value: 'SS' },
    { text: 'Spain', key: 'ES', value: 'ES' },
    { text: 'Sri Lanka', key: 'LK', value: 'LK' },
    { text: 'Sudan (the)', key: 'SD', value: 'SD' },
    { text: 'Suriname', key: 'SR', value: 'SR' },
    { text: 'Svalbard and Jan Mayen', key: 'SJ', value: 'SJ' },
    { text: 'Sweden', key: 'SE', value: 'SE' },
    { text: 'Switzerland', key: 'CH', value: 'CH' },
    { text: 'Syrian Arab Republic', key: 'SY', value: 'SY' },
    { text: 'Taiwan (Province of China)', key: 'TW', value: 'TW' },
    { text: 'Tajikistan', key: 'TJ', value: 'TJ' },
    { text: 'Tanzania, United Republic of', key: 'TZ', value: 'TZ' },
    { text: 'Thailand', key: 'TH', value: 'TH' },
    { text: 'Timor-Leste', key: 'TL', value: 'TL' },
    { text: 'Togo', key: 'TG', value: 'TG' },
    { text: 'Tokelau', key: 'TK', value: 'TK' },
    { text: 'Tonga', key: 'TO', value: 'TO' },
    { text: 'Trinidad and Tobago', key: 'TT', value: 'TT' },
    { text: 'Tunisia', key: 'TN', value: 'TN' },
    { text: 'Turkey', key: 'TR', value: 'TR' },
    { text: 'Turkmenistan', key: 'TM', value: 'TM' },
    { text: 'Turks and Caicos Islands (the)', key: 'TC', value: 'TC' },
    { text: 'Tuvalu', key: 'TV', value: 'TV' },
    { text: 'Uganda', key: 'UG', value: 'UG' },
    { text: 'Ukraine', key: 'UA', value: 'UA' },
    { text: 'United Arab Emirates (the)', key: 'AE', value: 'AE' },
    { text: 'United Kingdom of Great Britain and Northern Ireland (the)', key: 'GB', value: 'GB' },
    { text: 'United States Minor Outlying Islands (the)', key: 'UM', value: 'UM' },
    { text: 'United States of America (the)', key: 'US', value: 'US' },
    { text: 'Uruguay', key: 'UY', value: 'UY' },
    { text: 'Uzbekistan', key: 'UZ', value: 'UZ' },
    { text: 'Vanuatu', key: 'VU', value: 'VU' },
    { text: 'Venezuela (Bolivarian Republic of)', key: 'VE', value: 'VE' },
    { text: 'Viet Nam', key: 'VN', value: 'VN' },
    { text: 'Virgin Islands (British)', key: 'VG', value: 'VG' },
    { text: 'Virgin Islands (U.S.)', key: 'VI', value: 'VI' },
    { text: 'Wallis and Futuna', key: 'WF', value: 'WF' },
    { text: 'Western Sahara', key: 'EH', value: 'EH' },
    { text: 'Yemen', key: 'YE', value: 'YE' },
    { text: 'Zambia', key: 'ZM', value: 'ZM' },
    { text: 'Zimbabwe', key: 'ZW', value: 'ZW' },
]

class FirstLogin extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            banner: null,
            avatar: null,
            slogan: '',
            country: '',
            city: '',
            street: '',
            department: '',
            birthday: '',
            phone: '',
            isLoading: false,
            bannerPreviewUrl: unknownBanner,
            avatarPreviewUrl: unknownAvatar,
        }

        this.handleSloganChange = this.handleSloganChange.bind(this)
        this.handleCityChange = this.handleCityChange.bind(this)
        this.handleStreetChange = this.handleStreetChange.bind(this)
        this.handleDepartmentChange = this.handleDepartmentChange.bind(this)
        this.handleBirthdayChange = this.handleBirthdayChange.bind(this)
        this.handlePhoneChange = this.handlePhoneChange.bind(this)
        this.handleCountryChange = this.handleCountryChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    componentDidMount() {
        var bannerHeader = new Headers()
        bannerHeader.append('Authorization', 'Bearer ' + localStorage.getItem('token'))

        var requestOptions = {
            method: 'GET',
            headers: bannerHeader,
            redirect: 'follow',
        }

        fetch(process.env.REACT_APP_API_URL + `/api/user/getUserInformation`, requestOptions)
            .then((res) => res.json())
            .then((res) => {
                if (res.length > 0) {
                    this.setState({
                        birthday: res[0].user_birthday,
                        city: res[0].user_city,
                        country: res[0].user_country,
                        department: res[0].user_department,
                        phone: res[0].user_phone,
                        slogan: res[0].user_slogan,
                        street: res[0].user_street,
                    })
                    if (res[0].banner !== '') {
                        this.setState({
                            bannerPreviewUrl: process.env.REACT_APP_API_URL + res[0].banner.replace('./static/', '/static/'),
                        })
                    }
                    if (res[0].avatar !== '') {
                        this.setState({
                            avatarPreviewUrl: process.env.REACT_APP_API_URL + res[0].avatar.replace('./static/', '/static/'),
                        })
                    }
                }
            })
    }

    bannerInputRef = React.createRef()
    avatarInputRef = React.createRef()

    bannerChange = (e) => {
        this.setState({ banner: e.target.files[0] })

        let reader = new FileReader()
        let file = e.target.files[0]

        reader.onloadend = () => {
            this.setState({
                bannerPreviewUrl: reader.result,
            })
        }

        reader.readAsDataURL(file)
    }

    avatarChange = (e) => {
        this.setState({ avatar: e.target.files[0] })

        let reader = new FileReader()
        let file = e.target.files[0]

        reader.onloadend = () => {
            this.setState({
                avatarPreviewUrl: reader.result,
            })
        }

        reader.readAsDataURL(file)
    }

    bannerUpload = () => {
        let element = document.querySelector('.setupForm')

        element = element.querySelector('input.bannerUpload').files[0]

        const formData = new FormData()
        formData.append('banner', element)

        var myHeaders = new Headers()
        myHeaders.append('Authorization', 'Bearer ' + localStorage.getItem('token'))

        fetch(process.env.REACT_APP_API_URL + `/api/user/uploadBanner`, {
            // Your POST endpoint
            method: 'POST',
            //mode: 'no-cors',
            headers: myHeaders,
            body: formData,
        })
    }

    avatarUpload = () => {
        let element = document.querySelector('.setupForm')

        element = element.querySelector('input.avatarUpload').files[0]

        const formData = new FormData()
        formData.append('avatar', element)

        var myHeaders = new Headers()
        myHeaders.append('Authorization', 'Bearer ' + localStorage.getItem('token'))

        fetch(process.env.REACT_APP_API_URL + `/api/user/uploadAvatar`, {
            // Your POST endpoint
            method: 'POST',
            //mode: 'no-cors',
            headers: myHeaders,
            body: formData,
        })
    }

    handleSloganChange(event) {
        this.setState({ slogan: event.target.value })
    }

    handleCityChange(event) {
        this.setState({ city: event.target.value })
    }

    handleStreetChange(event) {
        this.setState({ street: event.target.value })
    }

    handleDepartmentChange(event) {
        this.setState({ department: event.target.value })
    }

    handleBirthdayChange(event) {
        this.setState({ birthday: event.target.value })
    }

    handlePhoneChange(event) {
        this.setState({ phone: event.target.value })
    }

    handleCountryChange(e, { value }) {
        this.setState({ country: value })
    }

    handleSubmit(event) {
        event.preventDefault()

        this.setState({ isLoading: true })

        var inputs = document.querySelectorAll('.setupForm input')

        for (var i = 0; i < inputs.length; i++) {
            if (inputs[i].type == 'submit') {
                inputs[i].disabled = 'disabled'
            }
        }

        // User Pictures

        if (this.state.banner !== null) {
            this.bannerUpload()
        }

        if (this.state.avatar !== null) {
            this.avatarUpload()
        }

        // User Information

        let slogan = this.state.slogan
        let country = this.state.country
        let city = this.state.city
        let street = this.state.street
        let department = this.state.department
        let birthday = this.state.birthday
        let phone = this.state.phone

        let formContent = [slogan, country, city, street, department, birthday, phone]

        var myHeaders = new Headers()
        myHeaders.append('Authorization', 'Bearer ' + localStorage.getItem('token'))
        myHeaders.append('Content-Type', 'application/x-www-form-urlencoded')

        var urlencoded = new URLSearchParams()
        urlencoded.append('slogan', slogan)
        urlencoded.append('country', country)
        urlencoded.append('city', city)
        urlencoded.append('street', street)
        urlencoded.append('department', department)
        urlencoded.append('birthday', birthday)
        urlencoded.append('phone', phone)

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: urlencoded,
            redirect: 'follow',
        }

        fetch(process.env.REACT_APP_API_URL + '/api/user/setupUser', requestOptions)
            .then((response) => response.text())
            .then((result) => {
                this.props.handleStateChange()

                this.setState({ isLoading: false })
            })
    }

    render() {
        const { file } = this.state
        return (
            <Modal className="first-login-modal" onClose={() => this.props.handleStateChange()} open={true} size="tiny">
                <Modal.Header>Set up your account</Modal.Header>
                <Modal.Content>
                    <Modal.Description>
                        <Header>Welcome to WorkGroup.</Header>
                        <p>Get started and set up your account. Start adding your slogan, your department and more.</p>
                    </Modal.Description>
                    <br />

                    <img src={this.state.bannerPreviewUrl} className="banner" onClick={() => this.bannerInputRef.current.click()} />
                    <img src={this.state.avatarPreviewUrl} className="avatar" onClick={() => this.avatarInputRef.current.click()} />

                    <Form className="setupForm">
                        <input ref={this.bannerInputRef} type="file" hidden onChange={this.bannerChange} className="bannerUpload" />
                        <input ref={this.avatarInputRef} type="file" hidden onChange={this.avatarChange} className="avatarUpload" />
                        <Form.Field>
                            <label>Your Slogan</label>
                            <TextArea value={this.state.slogan} onChange={this.handleSloganChange} placeholder="Tell us more about you" />
                        </Form.Field>
                        <Form.Field>
                            <label>Your Country</label>
                            <Dropdown placeholder="Select your Country" fluid search selection options={countryOptions} value={this.state.country} onChange={this.handleCountryChange} />
                        </Form.Field>
                        <Form.Field>
                            <label>Your City</label>
                            <Input value={this.state.city} onChange={this.handleCityChange} placeholder="Enter your City" />
                        </Form.Field>
                        <Form.Field>
                            <label>Your Street</label>
                            <Input value={this.state.street} onChange={this.handleStreetChange} placeholder="Enter your Street" />
                        </Form.Field>
                        <Form.Field>
                            <label>Your Department</label>
                            <Input value={this.state.department} onChange={this.handleDepartmentChange} placeholder="Enter your Department" />
                        </Form.Field>
                        <Form.Field>
                            <label>Your Birthday</label>
                            <Input value={this.state.birthday} onChange={this.handleBirthdayChange} type="date" placeholder="Enter your Birthday" />
                        </Form.Field>
                        <Form.Field>
                            <label>Your Phone</label>
                            <Input value={this.state.phone} onChange={this.handlePhoneChange} type="tel" placeholder="Enter your Phone" />
                        </Form.Field>
                    </Form>
                </Modal.Content>
                <Modal.Actions>
                    {this.state.isLoading === true ? (
                        <Button
                            loading
                            content="Save"
                            labelPosition="right"
                            icon="checkmark"
                            //onClick={() => this.props.handleStateChange()}
                            positive
                        />
                    ) : (
                        <Button
                            content="Save"
                            labelPosition="right"
                            icon="checkmark"
                            //onClick={() => this.props.handleStateChange()}
                            onClick={this.handleSubmit}
                            positive
                        />
                    )}
                </Modal.Actions>
            </Modal>
        )
    }
}

export default FirstLogin

FirstLogin.propTypes = {
    handleStateChange: PropTypes.any,
}
