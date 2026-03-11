const anchorTownInput = document.getElementById("anchorTown");
const generateBtn = document.getElementById("generateBtn");
const calendarGrid = document.getElementById("calendarGrid");
const postCardTemplate = document.getElementById("postCardTemplate");
const allowResourceCommentsCheckbox = document.getElementById("allowResourceComments");
const fundingModeSelect = document.getElementById("fundingMode");

/**
 * Replace these with your actual links.
 * Keep them out of the main post body.
 * They are only used in the optional "first comment" field.
 */
const RESOURCE_LINKS = {
  bankBreezyApplication: "https://bankbreezy.com/funding/jason",
  dacApplication: "https://davidallencapital.com/select-funding/jason",
  bankBreezyInfo: "https://bankbreezy.com/jason",
  dacInfo: "https://davidallencapital.com/jason"
};

const APPROVED_APPROACH = {
  hybrid: {
    label: "Bank Breezy powered by DAC",
    shortPitch: "fast funding options when speed matters, with DAC-backed credibility when the business needs more room",
    resourceLabel: "Bank Breezy application",
    resourceUrl: RESOURCE_LINKS.bankBreezyApplication,
    secondaryLabel: "DAC larger-funding information",
    secondaryUrl: RESOURCE_LINKS.dacInfo
  },
  bb: {
    label: "Bank Breezy",
    shortPitch: "same-day and smaller-ticket funding paths for contractors, gig workers, service workers, and self-employed owners",
    resourceLabel: "Bank Breezy application",
    resourceUrl: RESOURCE_LINKS.bankBreezyApplication,
    secondaryLabel: "Bank Breezy funding info",
    secondaryUrl: RESOURCE_LINKS.bankBreezyInfo
  },
  dac: {
    label: "DAC",
    shortPitch: "larger working-capital conversations for established businesses that need more than a quick small-ticket option",
    resourceLabel: "DAC application",
    resourceUrl: RESOURCE_LINKS.dacApplication,
    secondaryLabel: "DAC business funding info",
    secondaryUrl: RESOURCE_LINKS.dacInfo
  }
};

function sanitizeTown(value) {
  return value
    .replace(/https?:\/\/\S+/gi, "")
    .replace(/www\.\S+/gi, "")
    .replace(/[^a-zA-Z\s'.-]/g, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function stripHardPitchLanguage(text) {
  return text
    .replace(/https?:\/\/\S+/gi, "")
    .replace(/www\.\S+/gi, "")
    .replace(/\b(?:apply now|buy now|click here|sign up now|guaranteed approval|instant approval)\b/gi, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function buildLocationModifiers(town) {
  return {
    anchor: `Based in ${town}`,
    radius: `${town} and surrounding areas`,
    spotlight: `${town} business owners`
  };
}

function buildBrandFlavor(mode) {
  return APPROVED_APPROACH[mode] || APPROVED_APPROACH.hybrid;
}

function buildOptionalFirstComment(postKey, mode, town) {
  const flavor = buildBrandFlavor(mode);

  if (postKey === "local") {
    return `Optional resource for ${town}-area owners who ask how funding options work privately:
${flavor.secondaryLabel}: ${flavor.secondaryUrl}`;
  }

  if (postKey === "education") {
    return `If this hits home and you want to explore options privately, here’s a resource:
${flavor.resourceLabel}: ${flavor.resourceUrl}`;
  }

  return `For anyone who wants to compare options without pressure, here’s a private starting point:
${flavor.resourceLabel}: ${flavor.resourceUrl}`;
}

function buildPosts(town, fundingMode, allowResourceComments) {
  const modifiers = buildLocationModifiers(town);
  const flavor = buildBrandFlavor(fundingMode);

  const posts = [
    {
      key: "local",
      day: "Day 1",
      type: "Local Interactor",
      modifier: modifiers.spotlight,
      rationale:
        "This is the community-facing post. It supports local wins, avoids pitching, and makes you look like part of the town instead of another random funding account.",
      copy: stripHardPitchLanguage(
`${modifiers.spotlight} —

Love seeing local businesses keep moving.

A packed shop, a new truck on the road, a full appointment book, a hiring update, a renovation, a community event done right — that stuff matters.

Small business momentum changes the feel of a town. Rooting for more local wins this week.`
      ),
      firstComment: allowResourceComments ? buildOptionalFirstComment("local", fundingMode, town) : ""
    },
    {
      key: "education",
      day: "Day 2",
      type: "Education / Reassurance",
      modifier: modifiers.radius,
      rationale:
        "This follows the DAC reassurance-led post type. It reframes funding shame, stays plainspoken, and earns the right to offer a private resource in the first comment.",
      copy: stripHardPitchLanguage(
`${modifiers.radius} —

Banks decline most small business loan applications. That doesn't mean the business is weak.

A lot of real businesses get judged by boxes that don’t reflect how they actually operate. Seasonality, timing gaps, uneven deposits, or recent growth can make a solid business look wrong on paper.

Most owners do not need more pressure. They need a clearer path and options that fit real business life.`
      ),
      firstComment: allowResourceComments ? buildOptionalFirstComment("education", fundingMode, town) : ""
    },
    {
      key: "insight",
      day: "Day 3",
      type: "Insight / Soft Invitation",
      modifier: modifiers.anchor,
      rationale:
        "This combines DAC’s observation-style trust building with the soft invitation pattern. It should start conversation, not force action.",
      copy: stripHardPitchLanguage(
`${modifiers.anchor} —

One thing I hear often from business owners is that they wait too long to look at funding because they assume needing options means something is wrong.

Usually it’s not panic. It’s payroll timing, inventory timing, equipment timing, or just wanting breathing room before a decision gets expensive.

That’s especially true for owners moving fast who do not have time to chase ten different lenders on their own.

Comment or message me. Happy to talk it through.`
      ),
      firstComment: allowResourceComments ? buildOptionalFirstComment("insight", fundingMode, town) : ""
    }
  ];

  return applyFundingFlavor(posts, fundingMode, flavor, town);
}

function applyFundingFlavor(posts, fundingMode, flavor, town) {
  return posts.map((post) => {
    let updatedCopy = post.copy;

    if (fundingMode === "bb") {
      if (post.key === "education") {
        updatedCopy = stripHardPitchLanguage(
`${post.modifier} —

Banks decline most small business loan applications. That doesn't mean the business is weak.

A lot of contractors, gig workers, service businesses, and self-employed owners get overlooked because their income pattern doesn’t fit a neat box.

Speed matters. Simplicity matters. And sometimes the right option is the one that gets the owner moving again without turning the process into a second job.`
        );
      }

      if (post.key === "insight") {
        updatedCopy = stripHardPitchLanguage(
`${post.modifier} —

A real pattern I see with self-employed owners is this: they don’t ignore funding because they’re careless. They ignore it because they’re busy doing the actual work.

They’re in the truck, on the job, on calls, handling payroll, covering materials, or trying to keep the schedule from slipping.

When the process is simple, decisions get made earlier and with less stress.

Comment or message me. Happy to talk it through.`
        );
      }
    }

    if (fundingMode === "dac") {
      if (post.key === "education") {
        updatedCopy = stripHardPitchLanguage(
`${post.modifier} —

Banks decline most small business loan applications. That doesn't mean the business is weak.

A growing company can still get boxed out if the timing is off, the structure is rigid, or the request doesn’t fit the way traditional lenders think.

Sometimes the issue is not the business. It’s that the business needs a broader set of options than one bank conversation can provide.`
        );
      }

      if (post.key === "insight") {
        updatedCopy = stripHardPitchLanguage(
`${post.modifier} —

One thing I notice in conversations with established business owners is that they often wait until pressure is high before exploring capital.

That delay gets expensive. Growth moves slower, equipment decisions get pushed, and opportunities get missed while the owner tries to piece things together alone.

Clear options create leverage. Comment or message me. Happy to talk it through.`
        );
      }
    }

    if (fundingMode === "hybrid" && post.key === "insight") {
      updatedCopy = stripHardPitchLanguage(
`${post.modifier} —

One thing I hear often from business owners is that they wait too long to look at funding because they assume needing options means something is wrong.

Usually it’s not. It’s just the owner trying to move faster than the banks move.

Some businesses need a quick smaller option. Some need more room and a broader capital conversation. The mistake is waiting until the pressure gets worse.

Comment or message me. Happy to talk it through.`
      );
    }

    return {
      ...post,
      copy: updatedCopy,
      rationale: `${post.rationale} Brand angle: ${flavor.label} focuses on ${flavor.shortPitch}.`
    };
  });
}

function renderPosts(posts) {
  calendarGrid.innerHTML = "";

  posts.forEach((post) => {
    const fragment = postCardTemplate.content.cloneNode(true);

    const dayLabel = fragment.querySelector(".day-label");
    const postType = fragment.querySelector(".post-type");
    const modifierChip = fragment.querySelector(".modifier-chip");
    const postCopy = fragment.querySelector(".post-copy");
    const commentWrap = fragment.querySelector(".first-comment-wrap");
    const commentCopy = fragment.querySelector(".comment-copy");
    const rationaleCopy = fragment.querySelector(".rationale-copy");
    const copyPostBtn = fragment.querySelector(".copy-post-btn");
    const copyCommentBtn = fragment.querySelector(".copy-comment-btn");

    dayLabel.textContent = post.day;
    postType.textContent = post.type;
    modifierChip.textContent = post.modifier;
    postCopy.textContent = post.copy;
    rationaleCopy.textContent = post.rationale;

    if (post.firstComment) {
      commentWrap.classList.remove("hidden");
      commentCopy.textContent = post.firstComment;
      copyCommentBtn.classList.remove("hidden");
    }

    copyPostBtn.addEventListener("click", async () => {
      await copyText(post.copy, copyPostBtn, "Copy post");
    });

    copyCommentBtn.addEventListener("click", async () => {
      await copyText(post.firstComment, copyCommentBtn, "Copy first comment");
    });

    calendarGrid.appendChild(fragment);
  });
}

async function copyText(text, button, defaultLabel) {
  try {
    await navigator.clipboard.writeText(text);
    button.textContent = "Copied";
    button.classList.add("copied");

    setTimeout(() => {
      button.textContent = defaultLabel;
      button.classList.remove("copied");
    }, 1400);
  } catch (error) {
    button.textContent = "Copy failed";
    setTimeout(() => {
      button.textContent = defaultLabel;
      button.classList.remove("copied");
    }, 1400);
  }
}

function generateContent() {
  const sanitizedTown = sanitizeTown(anchorTownInput.value);
  const fundingMode = fundingModeSelect.value;
  const allowResourceComments = allowResourceCommentsCheckbox.checked;

  if (!sanitizedTown) {
    anchorTownInput.value = "";
    anchorTownInput.placeholder = "Please enter a real town";
    anchorTownInput.focus();
    return;
  }

  anchorTownInput.value = sanitizedTown;

  const posts = buildPosts(sanitizedTown, fundingMode, allowResourceComments);
  renderPosts(posts);
}

generateBtn.addEventListener("click", generateContent);

anchorTownInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    generateContent();
  }
});

allowResourceCommentsCheckbox.addEventListener("change", generateContent);
fundingModeSelect.addEventListener("change", generateContent);

generateContent();
