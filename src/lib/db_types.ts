import { z } from "zod";

type StrictRecordModel = {
	id: string;
	created: string;
	updated: string;
	collectionId: string;
	collectionName: string;
}; // Same as pocketbase's record model, without the [key: string] : any

export const CommitteesSchema = z.union([
	z.literal("web"),
	z.literal("admin"),
	z.literal("events"),
	z.literal("operations")
]);

export const UserSchema = z.object({
	email: z.string().email(),
	name: z.string().min(3).max(48),
	avatar: z.string().optional(),
	four_digit_id: z.number().min(0).max(10000),
	homeroom: z.string().max(4),
	committees: CommitteesSchema.array().max(5),
	osis: z.number().min(0).max(999999999),
	is_tutee: z.boolean().default(false)
});

export const EventSchema = z.object({
	name: z.string().min(3).max(64),
	description: z.string().max(4000),
	start_time: z.coerce.date(),
	end_time: z.coerce.date(),
	multiplier: z.number().min(1).max(5).step(0.5).default(1),
	is_out_of_school: z.boolean().default(true),
	signed_up: z.string().array(),
	isComplete: z.boolean().default(false)
});

export const CreditSchema = z.object({
	credits: z.number().min(0.5),
	user: z.string(),
	event: z.string(),
	tutoringSession: z.string()
});

export const TutoringRequestSchema = z.object({
	class: z.string().min(2).max(64),
	teacher: z.string().min(2).max(64),
	topic: z.string().min(2).max(64),
	tutee: z.string().min(2).max(64),
	general_time: z.string().min(2).max(512),
	isClaimed: z.boolean().default(false)
});

export const TutoringSessionSchema = z.object({
	tutee: z.string().min(2).max(64),
	tutor: z.string().min(2).max(64),
	tutoringRequest: z.string().min(2).max(64),
	isComplete: z.boolean().default(false),
	dateCompleted: z.date().optional()
});

export const PublicUserDataSchema = UserSchema.pick({ email: true, name: true });

export type RecievedUser = z.infer<typeof UserSchema> & StrictRecordModel;
export type RecievedEvent = z.infer<typeof EventSchema> & StrictRecordModel;
export type RecievedCredit = z.infer<typeof CreditSchema> & StrictRecordModel;
export type RecievedTutoringRequest = z.infer<typeof TutoringRequestSchema> & StrictRecordModel;
export type RecievedTutoringSession = z.infer<typeof TutoringSessionSchema> & StrictRecordModel;
export type RecievedPublicUserData = z.infer<typeof PublicUserDataSchema> & StrictRecordModel;

export type ExpandedTutoringSession = {
	tutee_name?: string;
	tutee_email?: string;
	tutor_name?: string;
	tutor_email?: string;
	expand: {
		tutoringRequest: RecievedTutoringRequest;
	};
} & RecievedTutoringSession;
