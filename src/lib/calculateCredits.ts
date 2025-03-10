import type { RecievedCredit } from "$lib/db_types";

export default function calculateCredits(credits: RecievedCredit[] | undefined, type: "events" | "tutoring"): number {
    let total = 0;
    if (!credits) {
        return 0;
    }
    for (const credit of credits) {
        if ((type == "events" && credit.event) || (type == "tutoring" && credit?.tutoringSession)) {
            total += credit.credits;
        }
    }
    return total;
}