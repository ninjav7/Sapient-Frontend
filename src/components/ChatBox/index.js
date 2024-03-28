import React from 'react';
import { useRef, useState, useEffect} from 'react';
import styles from './Home.module.css';
import axios from 'axios';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Close, CommentSolid } from './icons';
import { UserStore } from '../../store/UserStore';
import { StartMSG, TEXT_FORMAT, STATIC_ANSWER, 
    GENERAL_ANSWER, API_ANSWER, 
    API_DROPDOWN_END_USE, API_DROPDOWN_EQUIPMENT, 
    API_DROPDOWN_EQUIPMENT_TYPE, API_DROPDOWN_SPACE_TYPE, 
    API_DROPDOWN_CIRCUIT, API_DROPDOWN_BUILDING, MenuProps} from "../../utils/constant";

export default function ChatBox(props) {
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [apiArr, setAPIArr] = useState([]);
    const [messageState, setMessageState] = useState({
        messages: [
            {
                message: StartMSG[Math.floor(Math.random() * 9)],
                type: 'apiMessage',
                data: [],
                format: TEXT_FORMAT,
            },
        ],
        history: [],
    });
    const [isOpenPopup, setOpenPopup] = useState(false);
    const [dropdownCategory, setDropdown] = useState('');
    const [dropdownValue, setDropdownValue] = useState('');
    const [dropdownTitle, setDropdownTitle] = useState('');
    const [dropdownValueArray, setDropdownValueArray] = useState([]);
    const { messages, history } = messageState;
    const [additionalComments, setAdditionalComments] = useState('');

    const DateNow = new Date();
    const [startDate, setStartDate] = useState(
        dayjs(DateNow.getFullYear() + '-' + DateNow.getMonth() + '-' + DateNow.getDate())
    );
    const [endDate, setEndDate] = useState(dayjs(new Date()));
    const [myDataRate, setMyDataRate] = useState(0);
    const [myAbilityRate, setMyAbilityRate] = useState(0);
    const [senderEmail, setSenderEmail] = useState('');
    const [EndUseArray, setEndUseArray] = useState([]);
    const [EquipmentArray, setEquipmentArray] = useState([]);
    const [BuildingArray, setBuildingArray] = useState([]);
    const [EquipmentTypeArray, setEquipmentTypeArray] = useState([]);
    const [savedAPI, setSavedAPI] = useState('');
    const [savedQuestion, setSavedQuestion] = useState('');
    const [savedFormat, setSavedFormat] = useState('');
    const [savedDropdownCategory, setSavedDropdownCategory] = useState('');
    const [buildingInfo, setBuildingInfo] = useState({ id: '', name: '' });

    const messageListRef = useRef(null);
    const textAreaRef = useRef(null);

    const backendAPI = axios.create({
        baseURL: 'https://backend.sapientchatbot.com'
    });
    backendAPI.defaults.headers.common['Content-Type'] = 'application/json';
    backendAPI.defaults.headers.common['User-Agent'] = 'XY';

    useEffect(() => {
        if (textAreaRef.current) textAreaRef.current.focus();
    }, []);

    useEffect(() => {
        if (messageListRef.current)
            messageListRef.current.scrollTo({ top: messageListRef.current.scrollHeight, behavior: 'smooth' });
    }, [messageState.messages]);

    useEffect(() => {
        if (textAreaRef.current) textAreaRef.current.focus();
        if (isOpenPopup == true) getPrePopulatedData();
    }, [isOpenPopup]);

    useEffect(() => {
        const title =
            dropdownCategory === API_DROPDOWN_END_USE
                ? 'Which end use?'
                : dropdownCategory === API_DROPDOWN_EQUIPMENT
                ? 'Which equipment?'
                : dropdownCategory === API_DROPDOWN_EQUIPMENT_TYPE
                ? 'Which equipment type?'
                : dropdownCategory === API_DROPDOWN_SPACE_TYPE
                ? 'Which space type?'
                : dropdownCategory === API_DROPDOWN_CIRCUIT
                ? 'Which circuit?'
                : dropdownCategory === API_DROPDOWN_BUILDING
                ? 'Which building?'
                : '';
        setDropdownTitle(title);
        if (dropdownCategory === API_DROPDOWN_END_USE) {
            setDropdownValueArray(EndUseArray);
        } else if (dropdownCategory === API_DROPDOWN_EQUIPMENT) {
            setDropdownValueArray(EquipmentArray);
        } else if (dropdownCategory === API_DROPDOWN_EQUIPMENT_TYPE) {
            setDropdownValueArray(EquipmentTypeArray);
        } else if (dropdownCategory === API_DROPDOWN_SPACE_TYPE) {
            setDropdownValueArray([]);
        } else if (dropdownCategory === API_DROPDOWN_CIRCUIT) {
            setDropdownValueArray([]);
        } else if (dropdownCategory === API_DROPDOWN_BUILDING) {
            setDropdownValueArray(BuildingArray);
        }
    }, [dropdownCategory]);

    const clearHistory = () => {
    };

    // chat box open button action
    const triggerPopup = () => {
        clearHistory();
        return (
            <button className={styles.btnchatbox}>
                {isOpenPopup ? (
                    <Close height="35" width="35" className={styles.btnchatboxicon} />
                ) : (
                    <CommentSolid height="35" width="35" className={styles.btnchatboxicon} />
                )}
            </button>
        );
    };

    const triggerFeedback = () => {
        return <a className={styles.feedback}>Leave your feedback...</a>;
    };

    // Open popup
    const openedPopup = () => {
        setOpenPopup(true);
    };

    // Close popup
    const closedPopup = () => {
        setOpenPopup(false);
    };

    const clearSavedAPIData = () => {
        setSavedAPI('');
        setSavedFormat('');
        setSavedQuestion('');
        setDropdown('');
        setDropdownValue('');
        setBuildingInfo({ id: '', name: '' });
    };

    const getPrePopulatedData = async () => {
        const response = await backendAPI.post('/api/get_prepopulated_data', {});
        const populatedData = await response.data;
        let tempArray = [];

        if (populatedData.building_data != null) {
            populatedData.building_data.map((item) => {
                tempArray.push({ id: item.building_id, name: item.building_name });
            });
            setBuildingArray(tempArray);
        }

        tempArray = [];
        if (populatedData.equip_type != null) {
            populatedData.equip_type.map((item) => {
                tempArray.push({ id: item.equipment_id, name: item.equipment_type });
            });
            setEquipmentTypeArray(tempArray);
        }

        tempArray = [];
        if (populatedData.end_use != null) {
            populatedData.end_use.map((item) => {
                tempArray.push({ id: item.end_user_id, name: item.name });
            });
            setEndUseArray(tempArray);
        }
    };

    async function getAPIAnswer(api, format, title, dropdown, type) {
        const question = title.trim();
        if (type != API_ANSWER)
            setMessageState((state) => ({
                ...state,
                messages: [
                    ...state.messages,
                    {
                        type: 'userMessage',
                        message: question,
                        data: [],
                        format: TEXT_FORMAT,
                    },
                ],
            }));

        setAPIArr([]);

        if (buildingInfo?.id == '' || buildingInfo?.name == '') {
            setDropdown(API_DROPDOWN_BUILDING);
            setSavedDropdownCategory(dropdown);
            setSavedAPI(api);
            setSavedQuestion(question);
            setSavedFormat(format);
            if (messageListRef.current)
                messageListRef.current.scrollTo({ top: messageListRef.current.scrollHeight, behavior: 'smooth' });
        } else {
            setDropdown(dropdown);

            clearSavedAPIData();
            setLoading(true);

            try {
                const stDate = startDate.get('year') + '-' + (startDate.get('month') + 1) + '-' + startDate.get('date');
                const enDate = endDate.get('year') + '-' + (endDate.get('month') + 1) + '-' + endDate.get('date');

                const response = await backendAPI.post('/api/get_api_answer', {
                    question: question,
                    api: api,
                    format: format,
                    type_id: '',
                    type_name: '',
                    stDate: stDate,
                    enDate: enDate,
                });
                const data = await response.data;

                if (data.error || response.status != 200) {
                    setTroubleshootMessage(question);
                } else {
                    setMessageState((state) => ({
                        ...state,
                        messages: [
                            ...state.messages,
                            {
                                type: 'apiMessage',
                                message: data.answer,
                                data: data.ref_data,
                                format: format,
                            },
                        ],
                        history: [...state.history, [question, data.answer]],
                    }));

                    props.chatHistory(messageState);
                }

                setLoading(false);

                //scroll to bottom
                if (messageListRef.current)
                    messageListRef.current.scrollTo({ top: messageListRef.current.scrollHeight, behavior: 'smooth' });
            } catch (error) {
                setLoading(false);
                setTroubleshootMessage(question);
            }
        }
    }

    const setTroubleshootMessage = (question) => {
        clearSavedAPIData();
        setMessageState((state) => ({
            ...state,
            messages: [
                ...state.messages,
                {
                    type: 'apiMessage',
                    message: "I'm having trouble connecting with your energy data, Please try again later.",
                    data: [],
                    format: TEXT_FORMAT,
                },
            ],
            history: [
                ...state.history,
                [question, "I'm having trouble connecting with your energy data, Please try again later."],
            ],
        }));
    };

    //handle form submission
    async function handleSubmit(e) {
        e.preventDefault();
        clearSavedAPIData();

        setError(null);

        if (!query) {
            UserStore.update((s) => {
                s.showNotification = true;
                s.notificationMessage = 'Please fill out the content';
                s.notificationType = 'error';
            });
            return 'Notify!';
        }

        const question = query.trim();

        setMessageState((state) => ({
            ...state,
            messages: [
                ...state.messages,
                {
                    type: 'userMessage',
                    message: question,
                    data: [],
                    format: TEXT_FORMAT,
                },
            ],
        }));

        setLoading(true);
        setQuery('');

        try {
            const stDate = startDate.get('year') + '-' + (startDate.get('month') + 1) + '-' + startDate.get('date');
            const enDate = endDate.get('year') + '-' + (endDate.get('month') + 1) + '-' + endDate.get('date');

            const response = await backendAPI.post('/api/get_answer', {
                question: question,
                stDate: stDate,
                enDate: enDate,
            });
            const data = await response.data;

            if (data.error || response.status != 200) {
                setTroubleshootMessage(question);
            } else {
                // if the question is calling the API or functional button directly, answer is empty and call getAPIAnswer directly
                if (data.answer.type !== undefined) {
                    if (data.answer.type == STATIC_ANSWER || data.answer.type == GENERAL_ANSWER) {
                        setMessageState((state) => ({
                            ...state,
                            messages: [
                                ...state.messages,
                                {
                                    type: 'apiMessage',
                                    message: data.answer.answer,
                                    data: [],
                                    format: TEXT_FORMAT,
                                },
                            ],
                            history: [...state.history, [question, data.answer.answer]],
                        }));

                        props.chatHistory(messageState);

                        setAPIArr(data.answer.api);
                    } else if (data.answer.type == API_ANSWER) {
                        const api = data.answer.api;
                        const dropdown = data.answer.dropdown;
                        const question = data.answer.question;
                        getAPIAnswer(api, '0', question, dropdown, API_ANSWER);
                    }
                } else {
                    setMessageState((state) => ({
                        ...state,
                        messages: [
                            ...state.messages,
                            {
                                type: 'apiMessage',
                                message: data.answer.answer,
                                data: [],
                                format: TEXT_FORMAT,
                            },
                        ],
                        history: [...state.history, [question, data.answer.answer]],
                    }));
                }
            }

            setLoading(false);

            //scroll to bottom
            if (messageListRef.current)
                messageListRef.current.scrollTo({ top: messageListRef.current.scrollHeight, behavior: 'smooth' });
        } catch (error) {
            setLoading(false);
            setTroubleshootMessage(question);
        }
    }

    //prevent empty submissions
    const handleEnter = (e) => {
        if (e.key === 'Enter' && query) {
            handleSubmit(e);
        } else if (e.key == 'Enter') {
            e.preventDefault();
        }
    };

    const handleFeedback = async (e) => {
        e.preventDefault();

        if (senderEmail == '') {
            // props.showToast("Please fill out your email", "warning");
            UserStore.update((s) => {
                s.showNotification = true;
                s.notificationMessage = 'Please fill out your email';
                s.notificationType = 'error';
            });
            // toast.warning("Please fill out your email", {position: toast.POSITION.BOTTOM_RIGHT});
            return 'Notify!';
        }

        let messageHistory = '';
        messages.map((message) => {
            if (message.type == 'apiMessage') messageHistory += 'AI : ' + message.message + '\n\n';
            else if (message.type == 'userMessage') messageHistory += 'User : ' + message.message + '\n\n';
        });

        const response = await backendAPI.post('/api/send_feedback', {
            feedback: additionalComments,
            history: messageHistory,
            rate_my_data: myDataRate,
            rate_my_ability: myAbilityRate,
            email: senderEmail,
        });
        const data = await response.data;
        let notifyMSG = "";
        let notifyType = "";
        if (data.result == 'success') {
            notifyMSG = "Thanks, Successfully sent!";
            notifyType = "success";
        } else {
            notifyMSG = "Sorry, Plesae try again later";
            notifyType = "error";
        }
        UserStore.update((s) => {
            s.showNotification = true;
            s.notificationMessage = notifyMSG;
            s.notificationType = notifyType;
        });
    };

    const clickRateMyData = (rate) => {
        setMyDataRate(rate);
    };

    const clickRateMyAnswer = (rate) => {
        setMyAbilityRate(rate);
    };

    const handleAdditionalComments = (e) => {
        setAdditionalComments(e.target.value);
    };

    const handleSenderEmail = (e) => {
        setSenderEmail(e.target.value);
    };

    const handleDropdown = async (event, dropdown_title) => {
        const selectedData = dropdownValueArray[parseInt(event.target.value)];
        let building_id = '',
            building_name = '';
        // if it is building information selection dropdown, re-display dropdown
        if (buildingInfo?.id == '' || buildingInfo?.name == '') {
            setBuildingInfo({ id: selectedData.id, name: selectedData.name });
            building_id = selectedData.id;
            building_name = selectedData.name;
            setDropdownValue(selectedData.name);
            setMessageState((state) => ({
                ...state,
                messages: [
                    ...state.messages,
                    {
                        type: 'apiMessage',
                        message: dropdown_title,
                        data: [],
                        format: TEXT_FORMAT,
                    },
                    {
                        type: 'userMessage',
                        message: selectedData.name,
                        data: [],
                        format: TEXT_FORMAT,
                    },
                ],
            }));

            if (savedDropdownCategory != '') {
                setDropdown(savedDropdownCategory);
                return;
            }
        } else {
            building_id = buildingInfo?.id;
            building_name = buildingInfo?.name;
            setDropdownValue(selectedData.name);
            setMessageState((state) => ({
                ...state,
                messages: [
                    ...state.messages,
                    {
                        type: 'apiMessage',
                        message: dropdown_title,
                        data: [],
                        format: TEXT_FORMAT,
                    },
                    {
                        type: 'userMessage',
                        message: selectedData.name,
                        data: [],
                        format: TEXT_FORMAT,
                    },
                ],
            }));
        }
        setDropdown('');
        setLoading(true);

        // savedAPI
        const stDate = startDate.get('year') + '-' + (startDate.get('month') + 1) + '-' + startDate.get('date');
        const enDate = endDate.get('year') + '-' + (endDate.get('month') + 1) + '-' + endDate.get('date');

        try {
            const response = await backendAPI.post('/api/get_api_answer', {
                question: savedQuestion,
                api: savedAPI,
                format: savedFormat,
                building_id: building_id,
                building_name: building_name,
                type_id: selectedData.id,
                type_name: selectedData.name,
                stDate: stDate,
                enDate: enDate,
            });
            const data = await response.data;

            if (data.error || response.status != 200) {
                setTroubleshootMessage(savedQuestion);
            } else {
                setMessageState((state) => ({
                    ...state,
                    messages: [
                        ...state.messages,
                        {
                            type: 'apiMessage',
                            message: data.answer,
                            data: data.ref_data,
                            format: savedFormat,
                        },
                    ],
                    history: [...state.history, [savedQuestion, data.answer]],
                }));

                props.chatHistory(messageState);
            }

            setLoading(false);

            //scroll to bottom
            if (messageListRef.current)
                messageListRef.current.scrollTo({ top: messageListRef.current.scrollHeight, behavior: 'smooth' });

            clearSavedAPIData();
        } catch (error) {
            setLoading(false);
            setTroubleshootMessage(savedQuestion);
        }
    };

    return (
        <div
            style={{
                position: 'fixed',
                bottom: '50px',
                right: '50px',
            }}>
            <Popup
                trigger={triggerPopup}
                position="left bottom"
                closeOnDocumentClick={false}
                closeOnEscape={true}
                repositionOnResize={true}
                arrow={false}
                contentStyle={{ maxWidth: '600px', width: '70vw', padding: '0px', borderRadius: '0.5rem' }}
                onOpen={openedPopup}
                onClose={closedPopup}>
                <div className="mx-auto flex flex-col gap-4">
                    <div className={styles.chatheader}>
                        <div className={styles.datepickerPanel}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                    slotProps={{ textField: { size: 'small' } }}
                                    label="Start Date"
                                    defaultValue={startDate}
                                    sx={{
                                        '& input': { color: 'white' },
                                        '& label': { color: 'white' },
                                        '& button': { color: 'white' },
                                    }}
                                    className={styles.startdatepicker}
                                    onChange={(date) => setStartDate(dayjs(date))}
                                />
                                <DatePicker
                                    slotProps={{ textField: { size: 'small' } }}
                                    label="End Date"
                                    defaultValue={endDate}
                                    sx={{
                                        '& input': { color: 'white' },
                                        '& label': { color: 'white' },
                                        '& button': { color: 'white' },
                                    }}
                                    className={styles.enddatepicker}
                                    onChange={(date) => setEndDate(dayjs(date))}
                                />
                            </LocalizationProvider>
                        </div>
                    </div>
                    <div ref={messageListRef} className={styles.messagelist}>
                        {messages.map((message, index) => {
                            let dropdown;
                            let className;
                            if (message.type === 'apiMessage') {
                                className = styles.apimessage;
                            } else {
                                // The latest message sent by the user will be animated while waiting for a response
                                className =
                                    loading && index === messages.length - 1
                                        ? styles.usermessagewaiting
                                        : styles.usermessage;
                            }

                            return (
                                <React.Fragment key={`chatMessage-${index}`}>
                                    <div key={`chatMessage-${index}`} className={className}>
                                        <div className={styles.markdownanswer}>
                                            <div dangerouslySetInnerHTML={{ __html: message.message }} />
                                        </div>
                                    </div>
                                    {dropdown}
                                </React.Fragment>
                            );
                        })}

                        {dropdownCategory !== '' && (
                            <div className={styles.apimessage}>
                                <FormControl sx={{ m: 1, width: '250px' }} variant="standard" fullWidth>
                                    <InputLabel id="label_category">{dropdownTitle}</InputLabel>
                                    <Select
                                        labelId="label_category"
                                        id="select_category"
                                        value={dropdownValue}
                                        label={dropdownTitle}
                                        onChange={(e) => handleDropdown(e, dropdownTitle)}
                                        MenuProps={MenuProps}
                                        autoWidth>
                                        {dropdownValueArray.map((value, i) => (
                                            <MenuItem value={i} key={i}>
                                                {value.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </div>
                        )}

                        {!loading &&
                            apiArr &&
                            apiArr.length > 0 &&
                            apiArr.map((api_item, index) => (
                                <>
                                    <div
                                        className={styles.apibutton}
                                        onClick={() =>
                                            getAPIAnswer(
                                                api_item.api,
                                                api_item.format,
                                                api_item.title != '' ? `${api_item.title}` : `${api_item.response}`,
                                                api_item.dropdown,
                                                GENERAL_ANSWER
                                            )
                                        }>
                                        {api_item.title != '' ? `${api_item.title}` : `${api_item.response}`}
                                    </div>
                                </>
                            ))}
                    </div>

                    {loading ? (
                        <div className={styles.loadingdiv}>
                            <span className={styles.loadingtext}>Generating...</span>
                        </div>
                    ) : (
                        <div>
                            {error ? (
                                <div className="border border-red-400 rounded-md p-4 m-1">
                                    <p className="text-red-500">{error}</p>
                                </div>
                            ) : (
                                <div className="w-full text-center">
                                    <form className={styles.typingform} onSubmit={handleSubmit}>
                                        <div className={styles.typingdiv}>
                                            <textarea
                                                disabled={loading}
                                                className={styles.typingbox}
                                                rows={1}
                                                onKeyDown={handleEnter}
                                                ref={textAreaRef}
                                                autoFocus={false}
                                                id="userInput"
                                                name="userInput"
                                                placeholder={loading ? 'Waiting for response...' : 'Ask me anything...'}
                                                value={query}
                                                onChange={(e) => setQuery(e.target.value)}
                                            />
                                        </div>
                                        <button className={styles.btnsend} type="submit" disabled={loading}>
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="30"
                                                height="30"
                                                viewBox="0 0 30 30"
                                                fill="none">
                                                <path
                                                    d="M7.60304 14.4388L13.9405 14.43M11.6869 5.56489L21.6924 10.5677C26.1826 12.8127 26.1737 16.4809 21.6924 18.7348L11.6869 23.7375C4.96053 27.1051 2.20281 24.3474 5.57041 17.6211L7.05533 14.6512L5.57041 11.6814C2.20281 4.95501 4.95169 2.20614 11.6869 5.56489Z"
                                                    stroke="white"
                                                    strokeWidth="2.10714"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            </svg>
                                        </button>
                                    </form>
                                    <Popup
                                        trigger={triggerFeedback}
                                        position="top center"
                                        closeOnDocumentClick={true}
                                        closeOnEscape={true}
                                        repositionOnResize={true}
                                        arrow={false}
                                        contentStyle={{
                                            maxWidth: '560px',
                                            width: '70vw',
                                            padding: '0px',
                                            margin: 'auto',
                                        }}>
                                        <form onSubmit={handleFeedback} className={styles.feedbackFrom}>
                                            <div>
                                                <input
                                                    type="text"
                                                    placeholder="Enter your email"
                                                    value={senderEmail}
                                                    onChange={handleSenderEmail}
                                                />
                                                <div>Rate My Data: </div>
                                                <div className="flex item-center">
                                                    <img
                                                        src="/rate_1.png"
                                                        alt="AI"
                                                        width="25"
                                                        height="25"
                                                        className={
                                                            myDataRate == 0 ? styles.emoticactive : styles.emotic
                                                        }
                                                        onClick={() => clickRateMyData(0)}
                                                        priority
                                                    />
                                                    <img
                                                        src="/rate_2.png"
                                                        alt="AI"
                                                        width="25"
                                                        height="25"
                                                        className={
                                                            myDataRate == 1 ? styles.emoticactive : styles.emotic
                                                        }
                                                        onClick={() => clickRateMyData(1)}
                                                        priority
                                                    />
                                                    <img
                                                        src="/rate_3.png"
                                                        alt="AI"
                                                        width="25"
                                                        height="25"
                                                        className={
                                                            myDataRate == 2 ? styles.emoticactive : styles.emotic
                                                        }
                                                        onClick={() => clickRateMyData(2)}
                                                        priority
                                                    />
                                                    <img
                                                        src="/rate_4.png"
                                                        alt="AI"
                                                        width="25"
                                                        height="25"
                                                        className={
                                                            myDataRate == 3 ? styles.emoticactive : styles.emotic
                                                        }
                                                        onClick={() => clickRateMyData(3)}
                                                        priority
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <div>Rate my ability to answer: </div>
                                                <div className="flex item-center">
                                                    <img
                                                        src="/rate_1.png"
                                                        alt="AI"
                                                        width="25"
                                                        height="25"
                                                        className={
                                                            myAbilityRate == 0 ? styles.emoticactive : styles.emotic
                                                        }
                                                        onClick={() => clickRateMyAnswer(0)}
                                                        priority
                                                    />
                                                    <img
                                                        src="/rate_2.png"
                                                        alt="AI"
                                                        width="25"
                                                        height="25"
                                                        className={
                                                            myAbilityRate == 1 ? styles.emoticactive : styles.emotic
                                                        }
                                                        onClick={() => clickRateMyAnswer(1)}
                                                        priority
                                                    />
                                                    <img
                                                        src="/rate_3.png"
                                                        alt="AI"
                                                        width="25"
                                                        height="25"
                                                        className={
                                                            myAbilityRate == 2 ? styles.emoticactive : styles.emotic
                                                        }
                                                        onClick={() => clickRateMyAnswer(2)}
                                                        priority
                                                    />
                                                    <img
                                                        src="/rate_4.png"
                                                        alt="AI"
                                                        width="25"
                                                        height="25"
                                                        className={
                                                            myAbilityRate == 3 ? styles.emoticactive : styles.emotic
                                                        }
                                                        onClick={() => clickRateMyAnswer(3)}
                                                        priority
                                                    />
                                                </div>
                                            </div>
                                            <textarea
                                                id="subject"
                                                name="message"
                                                placeholder="Additional Comments"
                                                style={{ height: '200px' }}
                                                value={additionalComments}
                                                onChange={handleAdditionalComments}></textarea>

                                            <button className={styles.feedbackBtn}>Submit</button>
                                        </form>
                                    </Popup>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </Popup>
        </div>
    );
}
