import {storage} from '@forge/api';
import {EventPayload} from "./event-payload";

interface IssueViewers {
	accountId: string;
	viewedAt: number;
}

const AVI_JIRA_VIEWED_ISSUE = "avi:jira:viewed:issue";
const AVI_JIRA_CREATED_ISSUE = "avi:jira:created:issue";

export const handler = async (payload: EventPayload, context: any) => {

	const accountId = payload.user.accountId;
	const eventType = payload.eventType;
	if (eventType !== AVI_JIRA_VIEWED_ISSUE && eventType !== AVI_JIRA_CREATED_ISSUE) {
		return;
	}

	const issueKey = payload.issue.key;
	console.log("Viewing issue: ", issueKey, " by user: ", accountId, " with event type: ", eventType);

	const response = await storage.get("view-" + issueKey);
	const viewers = (response || []) as Array<IssueViewers>;
	const filteredViewers = viewers.filter(viewer => viewer.accountId !== accountId);
	const updatedViewers = [{accountId: accountId, viewedAt: Date.now()}, ...filteredViewers];
	await storage.set("view-" + issueKey, updatedViewers);
};
