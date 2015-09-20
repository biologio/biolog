/**
 * To run these tests:
 *
 * VELOCITY_TEST_PACKAGES=1 meteor test-packages --driver-package velocity:html-reporter biolog:bioontology --settings private/settings.json
 */
function contains(a, obj) {
    for (var i = 0; i < a.length; i++) {
        if (a[i] == obj) {
            return true;
        }
    }
    return false;
}

var MED_QUERY="midri";

describe('Bioontology Settings', function () {
    beforeAll(function() {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = jasmine.getEnv().defaultTimeoutInterval = 30000;
    });

    it('expect Bioontology settings to be present', function () {
        expect(Bioontology.getApiKey()).toBeDefined();
        expect(Bioontology.getUrlSearch()).toBeDefined();
        expect(Bioontology.getUrlAnnotator()).toBeDefined();
    });
});


describe('Bioontology Conditions', function () {

    var errors = [];
    var ancestorErrors = [];
    var conditions = null;
    var classes = null;
    beforeAll(function(done) {
        var q = "diab";

        Bioontology.searchConditions(q, function(err, results){
            if (err) {
                errors.push(err);
                console.error(err);
            }
            conditions = results;

            //lookup ancestors for first condition
            Bioontology.getConditionClasses(conditions[0], function(err, conditionClasses) {
                if (err) {
                    ancestorErrors.push(err);
                }
                if (conditionClasses) classes = conditionClasses;
                done();
            });
        });
    });

    it('expect Bioontology search conditions for: diab', function () {
        if (errors && errors.length) console.error(errors);
        expect(errors.length).toBe(0);
        expect(conditions).toBeDefined();
        expect(conditions.length).toBeGreaterThan(10);
        console.log("conditionClasses=" + JSON.stringify(classes, null, "  "));
    });

    it('expect Bioontology to properly find classes for a condition', function () {
        if (ancestorErrors && ancestorErrors.length) console.error(ancestorErrors);
        expect(ancestorErrors.length).toBe(0);
        expect(classes).toBeDefined();
        expect(classes.length).toBeGreaterThan(2);

    });


});



describe('Bioontology Medicines', function () {

    var error = null;
    var meds = null;
    var ingredientErrors = [];
    var ancestorErrors = [];
    var ingredients = null;
    var classes = null;
    beforeAll(function(done) {

        Bioontology.searchMeds(MED_QUERY, function(err, results){
            error = err;
            meds = results;

            var med = meds[0];
            ingredients = [med];
            Bioontology.getIngredients(med, function(err, ingreds) {
                if (err) {
                    ingredientErrors.push(err);
                }
                if (!ingreds) {
                    done();
                    return;
                }
                ingredients = ingredients.concat(ingreds);

                console.log("\n\nNext test adding med classes to ingredients: " + JSON.stringify(ingredients));

                //lookup ancestors for first ingredient
                Bioontology.getMedClassesForEachIngredient(ingredients, function(err, medClasses) {
                    if (err) {
                        ancestorErrors.push(err);
                    }
                    if (medClasses) classes = medClasses;
                    done();
                });
            });
        });
    });

    it('expect Bioontology search medicines for: ' + MED_QUERY, function () {
        expect(error).toBeNull();
        expect(meds).toBeDefined();
        expect(meds.length).toBeGreaterThan(0);
    });

    it('expect Bioontology to properly find ingredients for a medicine', function () {
        if (ingredientErrors && ingredientErrors.length) console.error(ancestorErrors);
        expect(ingredientErrors.length).toBe(0);
        expect(ingredients).toBeDefined();
        expect(ingredients.length).toBe(4);

    });

    it('expect Bioontology to properly find classes for a medicine', function () {
        if (ancestorErrors && ancestorErrors.length) console.log("\nExceptions found looking up med ingredients (possibly because the info is lacking in MESH)" + ancestorErrors);
        //expect(ancestorErrors.length).toBe(0);
        expect(classes).toBeDefined();

        console.log("Medicine classes=" + JSON.stringify(classes, null, "  "));
        expect(classes.length).toBeGreaterThan(0);
    });
});




describe('Bioontology Annotator', function () {

    var theError = null;
    var theAnnotations = null;
    beforeEach(function(done) {
        var text = "I have a bad diabetes and I think I got it because I took steroids and also crestor.";

        Bioontology.annotateHealth(text, function(err, annotations){
            theError = err;
            theAnnotations = annotations;
            done();
        });

    });

    it('expect Bioontology annotator to annotate known text', function () {
        expect(theError).toBeNull();
        expect(theAnnotations).toBeDefined();
        //console.log("Bioontology annotations=" + JSON.stringify(theAnnotations, null, "  "));
        var a0 = theAnnotations[0];
        var a1 = theAnnotations[1];
        var a2 = theAnnotations[2];
        expect(Bioontology.getItemCui(a0.annotatedClass)).toEqual("C0011849");
        expect(Bioontology.getItemPreferredLabel(a0.annotatedClass)).toEqual("Diabetes Mellitus");
        var altLabels = Bioontology.getItemAlternateLabels(a0.annotatedClass);
        expect(contains(altLabels, "Diabetes")).toBe(true);
        var semanticTypes = Bioontology.getItemSemanticTypes(a0.annotatedClass);
        expect(contains(semanticTypes, "T047")).toBe(true);

        expect(Bioontology.getItemCui(a1.annotatedClass)).toEqual("C0038317");
        expect(Bioontology.getItemPreferredLabel(a1.annotatedClass)).toEqual("Steroids");

        expect(Bioontology.getItemCui(a2.annotatedClass)).toEqual("C1098080");
        expect(Bioontology.getItemPreferredLabel(a2.annotatedClass)).toEqual("Crestor");
    });
});

describe('Bioontology Annotator Long Text', function () {
    var theError = null;
    var theAnnotations = null;
    beforeEach(function(done) {
        var text = "Introduction Lyme disease is a growing health care problem in Northern Hemisphere countries worldwide, with cases in the United States increasing by approximately 200% in the last two decades. [1] [2] [3] Recent estimates indicate that the incidence of Lyme disease ranges from 240,000–440,000 new cases a year, making Lyme disease the seventh most common reportable infectious disease in the United States. [4] [5] The tick-borne bacteria associated with Lyme disease in North America, Borrelia burgdorferi, causes an early stage acute skin infection that often is associated with a skin lesion called erythema migrans. If left untreated, early Lyme disease may lead to neurologic and rheumatic manifestation weeks or months later. [6] Antibiotic treatment of Lyme disease is associated with more rapid resolution of early signs of infection and the prevention of the majority of the later, objective signs of disseminated infection. Approximately 10–20% of patients treated for Lyme disease with a recommended 2–4 week course of antibiotics will have patient-reported symptoms that may last for weeks, months or years. [7] [8] Post-treatment Lyme disease symptoms have been described by numerous investigators and include fatigue, musculoskeletal pain, and neurocognitive complaints such as poor memory and concentration and extremity dysthesias. In some cases, symptoms may be severe, chronic and adversely affect health-related function. [8] [9] [10] [11] When post-treatment Lyme disease symptoms (PTLDS) persist for six months or longer and are associated with functional limitations in the patient, the illness has been termed 'Post-treatment Lyme Disease Syndrome' by the Centers for Disease Control. [7] Because no sensitive biomarker for remotely treated Lyme disease exists, the true number of individuals at risk for the syndrome is unknown. [12] [13] Although the frequency of Lyme disease has increased, the overall impact of Lyme disease and PTLDS in the United States has been difficult to ascertain using methods that rely on patient reports and reviews of medical records. [14] As a result, little is known about the impact of Lyme disease infection on health care utilization and costs. Although a few studies have examined the costs associated with Lyme disease, most have been small-scale studies, many of which have focused on Western European nations. [15] [16] Moreover, of those studies that have looked at cost, the estimated impact of Lyme disease varies widely. Decision analysis models of Lyme disease treatment strategies have estimated the cost of acute uncomplicated Lyme disease to be less than $100 for the office visit, testing and antibiotic treatment. Late-stage Lyme disease with neurologic manifestation was estimated at $6,007. [17] [18] An early study from the Society of Actuaries that attempted to factor in PTLDS-related costs estimated the average cost of both uncomplicated and complicated cases to be approximately $10,000. [19] A Maryland study found that the annual direct medical cost of treating early- and late-stage Lyme disease decreased from means of $1,609 to $464 and $4,240 to $1,380, respectively, over the study period (1997–2000). [20] No attempt was made in this study to measure or account for PTLDS. All of the above studies have been limited by a lack of access to large, nationally representative samples. The few studies that have used larger administrative databases have been limited in scope, focusing on cost of laboratory testing only. [21] [22] [23] The association of PTLDS with Lyme disease and its significance remains controversial. Because of the limitations of the prior research in this area, the magnitude of health care utilization and costs associated with Lyme disease and PTLDS is currently unknown. The purpose of this study was threefold: first, to examine the impact of Lyme disease on 12-month health care costs and utilization, second, to understand the association between Lyme disease and risk of developing PTLDS, and third, to understand how PTLDS may impact 12-month health care costs and utilization. Methods This study utilizes retrospective data on medical claims for persons enrolled in commercial health insurance plans. Individuals treated for Lyme disease were identified and compared to a matched sample of controls with no evidence of Lyme disease exposure. Data All data were drawn from the IMS Health LifeLink Health Plan Claims Database, which contains retrospective data on medical claims and member enrollment for approximately 47 million persons enrolled in a wide range of US commercial health insurance plans. The initial 547,993 potential Lyme disease cases were selected based on presence of a Lyme disease diagnosis and/or test order between 2006–2010 [Fig. 1]. To increase the specificity of our identification of Lyme disease cases, we narrowed the case identification to include only those individuals with antibiotic treatment within 30 days of either a Lyme disease test order (CPT code 86618) and/or a Lyme disease diagnosis (ICD code 088.81). Of the original 547,993 persons with a Lyme disease test order and/or diagnosis, 109,141 (19.9%) received antibiotics appropriate for the treatment of Lyme disease within 30 days of that test order/diagnosis. thumbnail Download: PPT PowerPoint slide PNG larger image (1.05MB) TIFF original image (1.73MB) Fig 1. Lyme disease case selection flow diagram. doi:10.1371/journal.pone.0116767.g001 We further narrowed our sample to include only those individuals with 18 months of continuous enrollment in a health plan, including 6 months of enrollment prior to their Lyme disease episode as a “clean period” in which they were neither tested for, nor diagnosed with, Lyme disease. We excluded a relatively small number for whom insurance coverage was from any source other than a commercial or self-insured employer-sponsored health insurance plan, and individuals over 64 years of age. The final number of Lyme disease cases that met the above criteria totaled 52,795. The control group was also drawn from the IMS database and included only those individuals with no Lyme disease test orders or diagnoses, at least 18 months of continuous enrollment, and at least one paid outpatient claim. The control group was selected by performing a 5-to-1 matching of controls to cases using stratified random sampling without replacement, matching on age, sex, enrollment year, region, and payer type (commercial or self-insured). The final number of controls included in the analysis totaled 263,975. 12-month health care costs and utilization for the control group are measured from January 1 of the matched year. This study was ruled to be not human subjects research (NHSR) and thus IRB exempt by the Johns Hopkins School of Medicine Internal Review Board on 10/19/2011. The data utilized constitute fully de-identified data; the research file has an encrypted identifier and does not include patient names, addresses, or zip codes. Outcome measures We analyzed 11 measures of health care costs: total costs, total inpatient, total pharmacy, total outpatient, outpatient anesthesiology, outpatient evaluation and management, outpatient medicine, outpatient pathology laboratory, outpatient radiology, outpatient surgery, and all other outpatient costs. Current Procedure Terminology (CPT) codes were used to group outpatient costs by type of outpatient service. All cost variables are measured as the “allowed” amount as defined by the insurer and represent the cost summed over each member’s 12-month in-scope period. There are two measures of utilization, chosen because we hypothesized these categories would be most likely to be affected by a Lyme disease diagnosis: outpatient management and evaluation visits, and emergency department visits. Each utilization measure equals the total number of visits in that category in a 12-month period. The Johns Hopkins Adjusted Clinical Groups (ACG) System was used to measure morbidity burden and utilization. [24] Based on the Expanded Diagnosis Clusters (EDCs) of the ACG case-mix system, groupings of diagnosis codes associated with PTLDS were identified by a panel of clinicians familiar with Lyme disease. The 5 relevant EDCs identified were examined and any International Classifications of Diseases (ICD) codes within each EDC that were not associated with PTLDS were excluded. The 5 EDC categories containing only those PTLDS-related ICD codes used in the analysis include: debility and undue fatigue, musculoskeletal signs and symptoms, peripheral neuropathy/neuritis, arthropathy, and non-specific signs and symptoms. The analyses presented here utilize these predominantly symptom-based diagnostic codes, as objective biomarkers for the diagnosis of post-treatment Lyme disease syndrome are not available. [12] Each EDC category was converted into a binary variable indicating whether that individual had any claims in that category during the study period. Control variables The adjusted analyses presented here control for age, sex, region and enrollment year. In addition, the analyses control for a number of conditions associated with high costs and utilization. A clinical team identified 44 high cost conditions not related to Lyme disease by reviewing a complete list of EDCs created by the Johns Hopkins ACG system. A list of the 44 high cost conditions identified is available from the authors upon request. Cost and utilization analyses Unadjusted means for each category of cost and utilization were determined for both cases and controls and Welch’s t-tests were used to assess differences in means between the groups. Generalized linear models (GLM) were used to examine the relationship between Lyme disease status and cost. GLM models can account for non-normality in data distribution while still allowing for inferences about mean costs. The identity link and Gaussian distribution were utilized for all generalized linear model analyses. Negative binomial regression analysis, a technique commonly used with count data that is over-dispersed, was used to examine the adjusted impact of Lyme disease status on health care utilization. Huber/White sandwich estimators were used to determine the standard errors and p-values. Health outcomes analyses Unadjusted frequencies for each PTLDS-related EDC category were calculated for both groups and chi-square tests were conducted to assess whether there were statistically significant differences. Multivariable logistic regression analysis was used to examine the impact of Lyme disease on the odds of PTLDS-related diagnoses. PTLDS cost and utilization analyses The above analyses were repeated to compare cost and utilization outcomes in the Lyme disease group for those with 1 or more PTLDS-related claims relative to those with no PTLDS-related claims. All analyses presented here were completed using STATA v. 10. Results Demographics of the samples The distributions of age, sex and region of the Lyme disease cases in our sample are consistent with what one would expect given national statistics on Lyme disease [Table 1]. Both cases and controls are approximately 51% female. Nearly half of both groups are aged 45–64 years, with 31% between ages 21–44 and the remaining 19% under 20 years of age. The vast majority of those in our study—approximately 80%—reside in highly endemic geographic regions, including the Northeast, Mid-Atlantic and Great Lakes regions [Table 1, S1 Table]. The smaller number of cases in other regions may be due to travel exposure or to the possibility of low rates of transmission from ixodes scapularis vectors in southeastern states. This hypothesis is strengthened by the fact that the majority of our “non-endemic” cases came from the southeast and Appalachian regions and not from the central, plains or desert regions. The seasonal diagnosis of Lyme disease among our sample peaked in June and July, with a nadir in January and February [S1 Fig.], consistent with national statistics for Lyme disease. thumbnail Download: PPT PowerPoint slide PNG larger image (97KB) TIFF original image (595KB) Table 1. Characteristics of study sample. doi:10.1371/journal.pone.0116767.t001 Cost and utilization analyses Columns I and II of Table 2 show that, in most categories, unadjusted mean 12-month costs are up to two times higher for the Lyme disease cases as compared to the controls, and the unadjusted mean number of visits over a 12-month period were higher for the cases as compared to controls for both measures of utilization. Adjusted analyses (Column IV) show that Lyme disease is associated with $2,968 higher total health care costs (95% CI: 2,807–3,128, p<.001), $464 higher outpatient evaluation and management costs (95% CI: 456–472, p<.001) and $612 higher pharmacy costs (95% CI: 580–645, p<.001) over a 12-month period, as compared to the control group. Lyme disease is associated with 87% higher evaluation and management visits (95% CI: 86%-89%, p<.001) and 71% higher emergency department visits (95% CI: 68%-76%, p<.001) over a 12-month period, relative to the control group. thumbnail Download: PPT PowerPoint slide PNG larger image (162KB) TIFF original image (910KB) Table 2. 12-month health care costs and utilization, Lyme disease and control groups. doi:10.1371/journal.pone.0116767.t002 The adjusted analyses presented here control for a number of factors, including a variety of medical conditions that can result in high costs and greater utilization of health care. The differences between the findings of the unadjusted and adjusted analyses are likely due, in part, to differing rates of these conditions between the controls and cases. Post-treatment Lyme disease symptom analyses Table 3 shows that the unadjusted frequencies of various categories of post-treatment Lyme disease symptom (PTLDS)-related diagnoses are higher and statistically different across all categories for the Lyme disease group relative to the control group. thumbnail Download: PPT PowerPoint slide PNG larger image (108KB) TIFF original image (612KB) Table 3. Post-treatment Lyme disease symptom-related diagnoses, Lyme disease and control groups. doi:10.1371/journal.pone.0116767.t003 Adjusted analyses show that Lyme disease is associated with 4.77 times greater odds of having one or more PTLDS-related diagnosis (95% CI: 4.67–4.87, p<.001). Persons in the Lyme disease group had 5.47 times greater odds of experiencing debility and undue fatigue (95% CI: 5.35–5.60, p<.001), 2.6 times greater odds of experiencing peripheral neuropathy (95% CI: 2.57–2.74, p<.001) and 4.5 times greater odds of experiencing arthropathy (95% CI: 4.32–4.70, p<.001). Table 4 presents our analyses of the impact within the Lyme disease group of PTLDS-related conditions on 12-month costs and utilization. Unadjusted mean costs in all categories were twice as high, and the mean number of evaluation and management visits was higher for those with one or more PTLDS-related diagnosis, as compared to those with no PTLDS-related diagnoses (columns I and II). Adjusted analyses show that, among the Lyme disease group, having one or more PTLDS-related diagnosis was associated with $3,798 higher total costs (95% CI: 3,542–4,055, p<.001), 66% more outpatient evaluation and management visits (95% CI: 64%-69%, p<.001), and 89% more emergency department visits (95% CI: 81%-97%, p<.001) over a 12-month period, relative to those with no PTLDS-related diagnoses (column IV). thumbnail Download: PPT PowerPoint slide PNG larger image (115KB) TIFF original image (667KB) Table 4. Adjusted 12-month health care costs and utilization for patients in the Lyme disease sample with one or more post-treatment Lyme disease symptom (PTLDS)-related diagnosis, as compared to patients in Lyme disease sample with no post-treatment Lyme disease symptom-related diagnoses. doi:10.1371/journal.pone.0116767.t004 As with all analyses, in order for the above results to hold we assume minimal unmeasured confounding. Discussion Treatment of Lyme disease is known to be effective in preventing further complications such as meningitis and joint arthritis. However, the impact on health care utilization of symptoms that may persist after antibiotic treatment is unknown. [12]. The significance of persistent symptoms after completion of standard antibiotic therapy of Lyme disease is a controversial topic. At the core of the controversy is how common, severe and prolonged are post-treatment Lyme symptoms and how individuals should be diagnosed and treated when PTLDS is suspected. Assumptions used for cost effectiveness analysis have assumed a single visit would be necessary for early cutaneous disease,[18] however our data show that Lyme disease was associated with 87% more evaluation and management visits and 71% more emergency department visits as compared to controls. This increased utilization seems at odds with the community standard of care and the Infectious Disease Society Guidelines for the treatment of Lyme disease, which do not call for follow up visits to document response to treatment in early Lyme disease. [12] Mean total costs for individuals with Lyme disease were almost twice those of controls, and adjusted total costs were $2,968 greater. These figures are significantly higher than the $100 predicted costs of treating uncomplicated Lyme disease used in previous theoretical models and higher than the $464-$1,609 mean costs of treating early stage Lyme disease reported by Zhang et al. [20] This may reflect the importance of accounting for utilization and costs associated with PTLDS. Moreover, the especially large difference in laboratory costs between the groups suggests that physicians may be attempting to understand persistent symptoms experienced by individuals with PTLDS through further diagnostic testing. Over 63% of the Lyme disease cases had at least one diagnosis associated with PTLDS, which is 36 percentage points higher a rate than the prevalence of the same symptoms in our control population [Table 3]. Our estimates are higher than the CDC’s estimated rate of Post-Treatment Lyme Disease Syndrome of 10–20% in part because we examined the proportion of people with any PTLDS-related diagnosis, without requiring a demonstrated functional decline, which was not captured in this study. The difference may also reflect a greater complexity of our community-based sample and increased risk factors such as delayed diagnosis in our population compared to the more uniform populations of ideally diagnosed and treated patients studied in prospective cohorts in the literature. Fatigue is one of the central features of PTLDS. In our study, persons with Lyme disease were 5.5 times more likely to have a diagnosis of debility and undue fatigue, which suggests that fatigue after treatment of Lyme disease is more frequent than in the general population. Our data are limited by the inability to measure the severity of fatigue, however other studies have shown that fatigue can be severe and impact the health-related quality of life of patients. [25] Arthropathy and peripheral neuropathy also stood out, with cases having 4.5 and 2.6 greater odds of these diagnoses, respectively, as compared to controls. The relative infrequency of these diagnoses in the general population supports them as more specific markers of PTLDS. The diagnostic codes used for arthropathy and neuropathy cannot easily distinguish diagnoses based on symptoms versus clinical diagnoses confirmed by objective signs or laboratory testing. However, the increased frequency of these diagnostic codes among cases suggests that musculoskeletal and neurologic conditions are more common than among our controls. Sensitivity analyses were performed, looking at diagnoses that would not be expected to be related to Lyme disease. Diagnoses such as diabetes were found to be more prevalent in the control population than in the Lyme disease group [S2 Table]. The analyses presented here also indicate that PTLDS-related diagnoses are associated with notably higher utilization and costs among those with Lyme disease. Having one or more PTLDS-related diagnosis was associated with 66% more outpatient evaluation and management visits and adjusted 12-month total costs that were $3,798 higher as compared to those with Lyme disease with no PTLDS-related diagnoses. Limitations While an attempt was made to use a conservative case definition, it was not possible to examine medical records to confirm each case of Lyme disease. However, the specificity of our Lyme disease case definition was increased by including only the 20% of individuals who had antibiotic therapy prescribed following a diagnostic test order. Our percentage of “antibiotic confirmed” tests is similar to a recent report that 10–19% of Lyme disease tests performed in commercial labs are positive. [4] In addition, the geographic and seasonal characteristics of our cohort conform closely to the known epidemiology of Lyme disease. If the cohort were contaminated with patients being treated for illnesses incorrectly attributed to Lyme disease such as fibromyalgia, chronic fatigue syndrome or patients with medically unexplained symptoms, we would expect to see the markedly higher female to male ratio characteristic of those diagnoses, which was not observed. Costs for the Lyme disease group might be expected to be higher, particularly if expensive long term intravenous antibiotics were used, a practice that has been reported in the treatment of the more heterogeneous and complex group of patients with long term chronic symptoms where Lyme disease may not be the sole cause of illness. [26] However, we did not find increased costs associated with IV antibiotics in our study population [S3 and S4 Tables]. Our study sample included only persons under 65 years of age who were continuously enrolled in employer-sponsored health insurance plans for 18 months, thus, our sample may not be representative of all Lyme disease cases in the United States. In addition, our analyses only looked at costs over a 12-month period, so we were unable to capture any longer-term costs associated with Lyme disease or PTLDS, nor were our analyses able to account for any indirect costs or costs associated with lost productivity due to Lyme disease, which may be significant. [27] A key concern of ours was the degree to which PTLDS-related diagnoses may have been present prior to infection with Lyme disease. Among the Lyme disease group, 21,753 persons had no PTLDS-related diagnoses, 14,470 persons had one or more PTLDS-related diagnosis post-infection only, 9,308 persons had PTLDS-related diagnoses both pre- and post-infection and 7,264 had PTLDS-related diagnoses pre-infection only. Ultimately, we decided that a comparison between existing diagnoses for the Lyme disease group and existing diagnoses in the control group was a better “apples-to-apples” comparison. However, sensitivity analyses were performed comparing new (post-infection only) PTLDS-related diagnoses among the Lyme disease group to existing diagnoses among the control group [S5 and S6 Tables]. These analyses showed that, with the exception of musculoskeletal signs and symptoms, the Lyme disease group had less dramatic but still greater adjusted odds of all PTLDS-related diagnoses as compared to the control group. Conclusions Lyme disease and the ongoing symptoms that may occur after initial antibiotic treatment represent a significant source of health care utilization and costs. These increased costs may have a considerable impact on overall health care spending in the United States. Extrapolating from the data, if we assume that, per the estimates released by Hinckley et al., there are approximately 240,000–440,000 cases of Lyme disease annually [4], and using our estimate of $2,968 greater annual health care costs for those diagnosed with Lyme disease, the total direct medical costs attributable to Lyme disease and PTLDS could be somewhere between $712 million - $1.3 billion each year. As the number of cases increases, the future economic impact of Lyme disease would be expected to increase. The public health policy implications of this study are significant, particularly with the high number of cases in endemic regions and the potential for continued spread into new regions of the United States. Increased awareness of the potential complications associated with Lyme disease is crucial in the primary care and consultative settings to avoid misdiagnosis and unnecessary diagnostic testing. Public health and medical guidelines need to move beyond the debate over whether “chronic Lyme disease” exists, as, regardless of one’s perspective, these patients do demonstrate increased health care costs and utilization. Effective, cost-effective, and compassionate management of this group of patients is essential to decrease costs and improve outcomes even in the absence of a definitive understanding of the pathophysiology of this post-treatment illness. Supporting Information S1_Fig.pdf 1 / 7 figsharedownload S1 Fig. Distribution of Lyme disease sample by month of diagnosis doi:10.1371/journal.pone.0116767.s001 (PDF) S1 Table. Regions and States. doi:10.1371/journal.pone.0116767.s002 (PDF) S2 Table. Adjusted odds of non-PTLDS-related diagnoses for Lyme disease group versus control group. doi:10.1371/journal.pone.0116767.s003 (PDF) S3 Table. Type of antibiotic prescribed, Lyme disease sample. doi:10.1371/journal.pone.0116767.s004 (PDF) S4 Table. Home infusion analyses. doi:10.1371/journal.pone.0116767.s005 (PDF) S5 Table. Post-treatment Lyme disease-related condition presence by time of diagnosis (pre-Lyme disease and/or post-Lyme disease period), Lyme disease group. doi:10.1371/journal.pone.0116767.s006 (PDF) S6 Table. Post-treatment Lyme disease symptom-related diagnoses among Lyme disease and control groups, using diagnoses recorded post-Lyme disease episode only for Lyme disease group. doi:10.1371/journal.pone.0116767.s007 (PDF) Author Contributions Conceived and designed the experiments: EA JA KL JW. Performed the experiments: EA JA KL JW. Analyzed the data: EA KL. Contributed reagents/materials/analysis tools: EA JA KL JW. Wrote the paper: EA JA KL JW. References 1. Stanek G, Wormser GP, Gray J, Strle F (2012) Lyme borreliosis. Lancet 379(9814): 461–73. doi: 10.1016/S0140-6736(11)60103-7. pmid:21903253 View Article PubMed/NCBI Google Scholar 2. Bacon RM, Kugeler KJ, Mead PS (2008) Surveillance for Lyme disease—United States, 1992–2006. MMWR 57:1–9. pmid:19052530 View Article PubMed/NCBI Google Scholar 3. Centers for Disease Control and Prevention (2012) Reported Cases of Lyme Disease by Year, United States, 1996–2010. Available: http://www.cdc.gov/lyme/stats/chartstabl​es/casesbyyear.html. Accessed 2013 July 16. 4. Hinckley AF, Connally NP, Meek JI, Johnson BJ, Kemperman MM, et al. (2014) Lyme Disease Testing by Large Commercial Laboratories in the United States. Clin Infect Dis 59(5): 676–681. doi: 10.1093/cid/ciu397. pmid:24879782 View Article PubMed/NCBI Google Scholar 5. Centers for Disease Control and Prevention (2013) Notice to Readers: Final 2012 Reports of Nationally Notifiable Infectious Diseases. MMWR 62:669–82. pmid:24133698 View Article PubMed/NCBI Google Scholar 6. Steere AC (2001) Lyme Disease. N Engl J Med 345(2):115–25. pmid:11450660 doi: 10.1056/nejm200107123450207 View Article PubMed/NCBI Google Scholar 7. Centers for Disease Control and Prevention (2013) Post-Treatment Lyme Disease Syndrome. Available: http://www.cdc.gov/lyme/postLDS/index.ht​ml. Accessed July 2013 16. 8. Aucott JN, Rebman AW, Crowder LA, Kortte KB (2013) Post-Treatment Lyme Disease Syndrome symptomatology: Is there something here? Qual Life Res 22(1):75–84. pmid:22294245 doi: 10.1007/s11136-012-0126-6 View Article PubMed/NCBI Google Scholar 9. Shadick NA, Phillips CB, Sangha O, Logigian EL, Kaplan RF, et al. (1999) Musculoskeletal and neurologic outcomes in patients with previously treated Lyme disease. Ann Intern Med 131(12):919–26. pmid:10610642 doi: 10.7326/0003-4819-131-12-199912210-00003 View Article PubMed/NCBI Google Scholar 10. Fallon BA, Keilp JG, Corbera KM, Petkova E, Britton CB, et al. (2008) A randomized, placebo-controlled trial of repeated IV antibiotic therapy for Lyme encephalopathy. Neurology 70(13):992–1003. pmid:17928580 doi: 10.1212/01.wnl.0000284604.61160.2d View Article PubMed/NCBI Google Scholar 11. Klempner MS, Hu LT, Evans J, Schmid CH, Johnson GM, et al. (2001) Two controlled trials of antibiotic treatment in patients with persistent symptoms and a history of Lyme disease. N Engl J Med 345(2):85–92. pmid:11450676 doi: 10.1056/nejm200107123450202 View Article PubMed/NCBI Google Scholar 12. Wormser GP, Dattwyler RJ, Shapiro ED, Halperin JJ, Steere AC, et al. (2006) The clinical assessment, treatment, and prevention of lyme disease, human granulocytic anaplasmosis, and babesiosis: clinical practice guidelines by the Infectious Disease Society of America. Clin Infect Dis 43(9):1089–134. pmid:17029130 doi: 10.1086/508667 View Article PubMed/NCBI Google Scholar 13. Aguero-Rosenfeld ME, Nowakowski J, Bittker S, Cooper D, Nadelman RB, Wormser GP (1996) Evolution of the serologic response to Borrelia burgdorferi in treated patients with culture-confirmed erythema migrans. J Clin Microbiol 34(1):1–9. pmid:8748261 doi: 10.1016/s0002-9343(95)99915-9 View Article PubMed/NCBI Google Scholar 14. Aucott JN, Seifter A, Rebman AW (2012) Probable late Lyme disease: a variant manifestation of untreated Borrelia burgdorferi infection. BMC Infectious Diseases 12:173. pmid:22853630 doi: 10.1186/1471-2334-12-173 View Article PubMed/NCBI Google Scholar 15. Joss AW, Davidson MM, Ho-Yen DO, Ludbrook A (2003) Lyme disease—what is the cost for Scotland? Public Health 117(4): 264–73. pmid:12966749 doi: 10.1016/s0033-3506(03)00067-2 View Article PubMed/NCBI Google Scholar 16. Henningsson AJ, Malmvall BE, Ernerudh J, Matussek A, Forsberg P (2010) Neuroborreliosis—an epidemiological, clinical and healthcare cost study from an endemic area in the south-east of Sweden. Clin Microbiol Infect 16(8):1245–51. doi: 10.1111/j.1469-0691.2009.03059.x. pmid:19793326 View Article PubMed/NCBI Google Scholar 17. Maes E, Lecomte P, Ray N (1998) A cost-of-illness study of Lyme disease in the United States. Clin Ther 20(5):993–1008. pmid:9829450 doi: 10.1016/s0149-2918(98)80081-7 View Article PubMed/NCBI Google Scholar 18. Magid D, Schwartz B, Craft J, Schwartz JS (1992) Prevention of Lyme disease after tick bites. A cost-effectiveness analysis. N Engl J Med 327(8):534–41. pmid:1298217 doi: 10.1056/nejm199208203270806 View Article PubMed/NCBI Google Scholar 19. Vanderhoof IT and Vanderhoof-Forschner KM (1993) Lyme Disease: The Cost to Society. Contingencies 42–8. 20. Zhang X, Meltzer MI, Pena CA, Hopkins AB, Wroth L, Fix AD (2006) Economic Impact of Lyme Disease. Emerging Infect Dis 12(4):653–60. pmid:16704815 doi: 10.3201/eid1204.050602 View Article PubMed/NCBI Google Scholar 21. Muller I, Freitag MH, Poggensee G (2012) Evaluating frequency, diagnostic quality, and cost of Lyme borreliosis testing in Germany: a retrospective model analysis. Clin Dev Immunol 595427. 22. Strickland GT, Karp AC, Mathews A, Pena CA (1997) Utilization and cost of serologic tests for Lyme disease in Maryland. J Infect Dis 176(3):819–21. pmid:9291343 doi: 10.1086/517311 View Article PubMed/NCBI Google Scholar 23. Ley C, Le C, Olshen EM, Reingold AL (1994) The use of serologic tests for Lyme disease in a prepaid health plan in California. JAMA 271(6):460–3. pmid:8080498 doi: 10.1001/jama.1994.03510300066040 View Article PubMed/NCBI Google Scholar 24. Johns Hopkins School of Public Health. The Johns Hopkins ACG (R) System, Version 10. http://acg.jhsph.org. Accessed July 2013. 25. Krupp LB, Hyman LG, Grimson R, Coyle PK, Melville P, et al. (2003) Study and treatment of post Lyme disease (STOP-LD): A randomized double masked clinical trial. Neurology 60:1923–1930. pmid:12821734 doi: 10.1212/01.wnl.0000071227.23769.9e View Article PubMed/NCBI Google Scholar 26. Feder HM, Johnson BJB, O'Connell S, Shapiro ED, Steere AC, et al. (2007) A critical appraisal of 'Chronic Lyme disease'. N Engl J Med 357(14):1422–1430. pmid:17914043 doi: 10.1056/nejmra072023 View Article PubMed/NCBI Google Scholar 27. Johnson L, Aylward A, Stricker RB (2011) Healthcare access and burden of care for patients with Lyme disease: a large United States survey. Health Policy 102(1):64–71. doi: 10.1016/j.healthpol.2011.05.007. pmid:21676482 View Article PubMed/NCBI Google Scholar";

        Bioontology.annotateHealth(text, function(err, annotations){
            theError = err;
            theAnnotations = annotations;
            done();
        });

    });

    it('expect Bioontology annotator to annotate long text', function () {
        expect(theError).toBeNull();
        expect(theAnnotations).toBeDefined();
        //console.log("Bioontology annotations=" + JSON.stringify(theAnnotations, null, "  "));

        expect(theAnnotations.length).toBeGreaterThan(10);
    });
});



