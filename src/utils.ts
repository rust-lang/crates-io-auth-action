import * as core from "@actions/core";

export const TOKEN_KEY = "token";
export const REGISTRY_URL_KEY = "registryUrl";

/** Json Error Response of crates.io */
interface ErrorResponse {
    errors: Array<{ detail: string }>;
}

/** If true, the compiler considers `value` of type ErrorResponse */
function isErrorResponse(value: unknown): value is ErrorResponse {
    if (typeof value !== "object" || value === null) {
        return false;
    }

    const obj = value as Record<string, unknown>;

    if (
        !("errors" in obj) ||
        !Array.isArray(obj.errors) ||
        obj.errors.length === 0
    ) {
        return false;
    }

    for (const error of obj.errors) {
        if (
            typeof error !== "object" ||
            error === null ||
            !("detail" in error) ||
            typeof (error as Record<string, unknown>).detail !== "string"
        ) {
            return false;
        }
    }

    return true;
}

export async function throwHttpErrorMessage(
    operation: string,
    response: Response,
): Promise<void> {
    const responseText = await response.text();
    let errorMessage = `${operation}. Status: ${response.status.toString()}.`;

    let isValidJsonResponse = false;
    if (responseText) {
        try {
            const parsed: unknown = JSON.parse(responseText);
            if (isErrorResponse(parsed)) {
                for (const error of parsed.errors) {
                    errorMessage += ` Error: ${error.detail}`;
                }
                isValidJsonResponse = true;
            }
        } catch {
            // The response is not a valid JSON.
            // We'll just append the raw response text.
        }
    }
    if (!isValidJsonResponse) {
        errorMessage += ` Response: ${responseText}`;
    }

    throw new Error(errorMessage);
}

export function getTokensEndpoint(registryUrl: string): string {
    return `${registryUrl}/api/v1/trusted_publishing/tokens`;
}

export function runAction(fn: () => Promise<void>): void {
    fn().catch((error: unknown) => {
        const errorMessage =
            error instanceof Error ? error.message : String(error);
        core.setFailed(`Error: ${errorMessage}`);
    });
}
